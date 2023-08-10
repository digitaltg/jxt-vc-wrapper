const { atxSigner } = require('../lib/index')
const { beforeEach, before, describe } = require('mocha')
const {
  DEFAULT_ONG_LOCAL_PRIVATE_KEY_URI,
  LOCAL_CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE,
  ONG_TEST_PAYLOAD,
} = require('./data/constants')
const expect = require('chai').expect

let signer = null
before(async function () {
  const config = {
    PRIVATE_KEYS_URI_BASE: null,
    CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE: LOCAL_CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE,
    PRIVATE_KEY_URI: DEFAULT_ONG_LOCAL_PRIVATE_KEY_URI,

    CREDENTIAL_SCHEMA_TEMPLATE_URI: null,
    DOMAIN: 'localhost',
    TYPE: 'sample',
    VERSION: '1',
    ENTITY_NAME: 'Ong',
  }

  signer = await atxSigner(config)
})

describe('Entity Local: Signature', function () {
  it('should sign', async function () {
    this.timeout(10000)

    let uri = await signer.sign(ONG_TEST_PAYLOAD)

    expect(uri).to.be.an('string')
    expect(uri.length).to.not.eql(0)
    expect(uri).to.contains('JXT:')
  })
})

describe('Entity Local: Verification', function () {
  it('should verify', async function () {
    this.timeout(10000)

    let uri = await signer.sign(ONG_TEST_PAYLOAD)
    let { valid, credential } = await signer.verify(uri)

    expect(valid).to.be.true

    credential['@context'] = credential['@context'].filter(function (item) {
      return item !== 'https://w3id.org/security/suites/ed25519-2020/v1'
    })
    credential.credentialSubject['@context'] = credential.credentialSubject['@context'].filter(function (item) {
      return item !== 'https://w3id.org/security/suites/ed25519-2020/v1'
    })

    delete credential['proof']
    expect(credential).to.be.eql(ONG_TEST_PAYLOAD)
  })
})
