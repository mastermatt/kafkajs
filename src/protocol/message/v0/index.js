const Encoder = require('../../encoder')
const crc32 = require('../../crc32')
const { Types: Compression } = require('../compression')

/**
 * v0
 * Message => Crc MagicByte Attributes Key Value
 *   Crc => int32
 *   MagicByte => int8
 *   Attributes => int8
 *   Key => bytes
 *   Value => bytes
 */

module.exports = ({ compression = Compression.None, key, value }) => {
  const content = new Encoder()
    .writeInt8(0) // magicByte
    .writeInt8(compression & 0x3)
    .writeBytes(key)
    .writeBytes(value)

  const crc = crc32(content)
  return new Encoder().writeInt32(crc).writeEncoder(content)
}
