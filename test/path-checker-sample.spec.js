const { atxSigner } = require('../lib/index')
const { beforeEach, before, describe } = require('mocha')
const expect = require('chai').expect

const {
  TEST_PAYLOAD,
  PRIVATE_KEY_URI_JSON_PATH_CHECKER_VACCINATION,
  SCHEMA_TMPLATE_URI_JSON_PATH_CHECKER_VACCINATION,
} = require('./data/constants')

let signer = null

before(async function () {
  const config = {
    PRIVATE_KEY_URI: PRIVATE_KEY_URI_JSON_PATH_CHECKER_VACCINATION,
    CREDENTIAL_SCHEMA_TEMPLATE_URI: SCHEMA_TMPLATE_URI_JSON_PATH_CHECKER_VACCINATION,
    DOMAIN: 'pcf.pw',
    TYPE: 'dgc',
    VERSION: '2',
    ENTITY_NAME: null,
  }
  signer = await atxSigner(config)
})
describe('EDDSA Vaccination sample:  Signature', function () {
  it('should sign', async function () {
    this.timeout(10000)

    let uri = await signer.sign(TEST_PAYLOAD)

    expect(uri).to.be.an('string')
    expect(uri.length).to.not.eql(0)
    expect(uri).to.contains('JXT:')
  })
})

describe('EDDSA Vaccination sample:  Verification', function () {
  it('should verify', async function () {
    this.timeout(10000)

    let uri = await signer.sign(TEST_PAYLOAD)
    let { valid, credential } = await signer.verify(uri)
    expect(valid).to.be.true

    credential['@context'] = credential['@context'].filter(function (item) {
      return item !== 'https://w3id.org/security/suites/ed25519-2020/v1'
    })

    delete credential['proof']
    expect(credential).to.be.eql(TEST_PAYLOAD)
  })
})
