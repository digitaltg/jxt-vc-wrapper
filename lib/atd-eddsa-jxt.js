import { loadHttpKey, loadJsonKey } from './keys.js'
import { loadHttpTemplate, loadJsonTemplate } from './template.js'
import * as eddsaJxtSdk from '@digitaltg/eddsa-jxt-sdk'
import jsonxt from 'jsonxt'
import { fromatEntityPrivateKeyUri, fromatEntitySchemaTemplateUri, isHttpUri, isValidUriBaseUrl } from './utils.js'

//=>

/**
 *
 * @param {*} config
 * @returns
 */
export async function atxSigner(config) {
  const {
    //In case We are dealing with entity, we have to provide those base access uri
    PRIVATE_KEYS_URI_BASE, //Where will we fetch the private key, it can be null. If so we use the private key uri
    CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE, //Where will we find the entity schema template

    PRIVATE_KEY_URI,
    CREDENTIAL_SCHEMA_TEMPLATE_URI,
    DOMAIN,
    TYPE,
    VERSION,
    ENTITY_NAME,
  } = config

  //todo: in case the entity is defined use it to construct the different uri
  //todo: DOMAIN will be most of the time constant;
  let keyPair = null
  let template = null

  //When entity name is null, we ensure that uri fro key and template are provided
  if (ENTITY_NAME == null || ENTITY_NAME == undefined) {
    if (PRIVATE_KEY_URI == null || PRIVATE_KEY_URI == undefined) {
      throw new Error('PRIVATE KEY URI must be defined in the confid')
    }
    if (CREDENTIAL_SCHEMA_TEMPLATE_URI == null || CREDENTIAL_SCHEMA_TEMPLATE_URI == undefined) {
      throw new Error('PRIVATE KEY URI must be defined in the confid')
    }

    if (isHttpUri(PRIVATE_KEY_URI)) {
      keyPair = await loadHttpKey(PRIVATE_KEY_URI);
    } else {
      keyPair = await loadJsonKey(PRIVATE_KEY_URI)
    }

    if (isHttpUri(CREDENTIAL_SCHEMA_TEMPLATE_URI)) {
      template = await loadHttpTemplate(CREDENTIAL_SCHEMA_TEMPLATE_URI);
    } else {
      template = await loadJsonTemplate(CREDENTIAL_SCHEMA_TEMPLATE_URI)
    }
  } else {
    //TODO: ensure that entity has content

    //We have to fetch data base on the entity name
    if (PRIVATE_KEYS_URI_BASE == null || PRIVATE_KEYS_URI_BASE == undefined) {
      if (PRIVATE_KEY_URI == null || PRIVATE_KEY_URI == undefined) {
        throw new Error('Must provide either PRIVATE_KEYS_URI_BASE or PRIVATE_KEY_URI')
      }
    } else {
      //Base uri must be in the form '/home/' for 'http://ki.t/'
      if (!isValidUriBaseUrl(PRIVATE_KEYS_URI_BASE)) {
        throw new Error('PRIVATE_KEYS_URI_BASE in the config must end with a /')
      }
    }

    if (CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE == null || CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE == undefined) {
      throw new Error('CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE in the config must be defined')
    }

    if (!isValidUriBaseUrl(CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE)) {
      throw new Error('CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE in the config must end with a /')
    }

    //TODO export into a function
    let privateKeyUriUrl = fromatEntityPrivateKeyUri(PRIVATE_KEYS_URI_BASE, PRIVATE_KEY_URI, ENTITY_NAME)
    let entitySchemaTemplateUri = fromatEntitySchemaTemplateUri(CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE, ENTITY_NAME)

    if (isHttpUri(privateKeyUriUrl)) {
      keyPair = await loadHttpKey(privateKeyUriUrl);
    } else {
      keyPair = await loadJsonKey(privateKeyUriUrl)
    }

    if (isHttpUri(entitySchemaTemplateUri)) {
      template = await loadHttpTemplate(entitySchemaTemplateUri);
    } else {
      template = await loadJsonTemplate(entitySchemaTemplateUri)
    }
  }

  return {
    /**
     *
     * @param {*} credential
     * @returns
     */
    sign: async (credential) => {
      let signedData = await eddsaJxtSdk.sign(credential, keyPair)
      let packed = await eddsaJxtSdk.pack(signedData, DOMAIN, TYPE, VERSION, template)
      return packed
    },
    getConfig: () => config,

    /**
     * Verify and return the initial credential subject in case the signed credential
     * is valid
     *
     * @param {Object} signedCredentialJxt
     */
    verify: async (signedCredentialJxt) => {
      let unpacked = await jsonxt.unpack(signedCredentialJxt, (resolver_name, template_uri) => {
        return template
      })

      let result = await eddsaJxtSdk.verify(unpacked);
      return { valid: result.verified, credential: unpacked }
    },
  }
}
