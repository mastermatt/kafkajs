const { secureRandom, newLogger, createCluster, createTopic } = require('testHelpers')
const createProducer = require('../index')

describe('Producer > Disconnecting', () => {
  it('should not have net connections after disconnecting', async () => {
    const topicName = `test-topic-${secureRandom()}`
    await createTopic({ topic: topicName })

    const cluster = createCluster()
    const producer = createProducer({
      cluster: cluster,
      logger: newLogger(),
    })
    await producer.connect()

    const send$ = producer.send({ topic: topicName, messages: [{ value: 'foo' }] })
    await producer.disconnect()
    expect(cluster.isConnected()).toBeFalse()
    await send$

    expect(cluster.isConnected()).toBeFalse()
  })
})
