# Verifiable QR SDK for EDDSA on JSON-XT Credentials

JavaScript Implementation of W3C Verifiable QR Credentials with EDDSA and minimization to a QR code with [JSON-XT](https://jsonxt.io/).

# Install

```sh
npm install
```

# Usage

```javascript
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
```

or

```javascript
const config = {
  PRIVATE_KEYS_URI_BASE: REMOTE_PRIVATE_KEYS_URI_BASE,
  CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE: REMOTE_CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE,
  PRIVATE_KEY_URI: null, //DEFAULT_ONG_REMOTE_PRIVATE_KEY_URI,

  CREDENTIAL_SCHEMA_TEMPLATE_URI: null,
  DOMAIN: 'localhost',
  TYPE: 'sample',
  VERSION: '1',
  ENTITY_NAME: 'Ong',
}
```

```javascript
signer = await atxSigner(config)
let uri = await signer.sign(ONG_TEST_PAYLOAD)

let { valid, credential } = await signer.verify(uri)

```

When using remote fetchin data are like, configuration may look like

```javascript
{
  DEFAULT_ONG_LOCAL_PRIVATE_KEY_URI: path.join(path.dirname(__filename), 'entities', 'keys', 'key.json'),
  DEFAULT_ONG_REMOTE_PRIVATE_KEY_URI: 'http://localhost/sunbirdrc/keys/Ong.json',

  LOCAL_PRIVATE_KEYS_URI_BASE: path.join(path.dirname(__filename), 'entities', 'keys') + '/',
  LOCAL_CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE: path.join(path.dirname(__filename), 'entities', 'templates') + '/',

  REMOTE_PRIVATE_KEYS_URI_BASE: 'http://localhost/sunbirdrc/keys/',
  REMOTE_CREDENTIAL_SCHEMA_TEMPLATES_URI_BASE: 'http://localhost/sunbirdrc/schema_templates/',

  PRIVATE_KEY_URI_JSON_PATH_CHECKER_VACCINATION: path.join(path.dirname(__filename), 'pathchecker-eddsa-key.json'),
  SCHEMA_TMPLATE_URI_JSON_PATH_CHECKER_VACCINATION: path.join(
    path.dirname(__filename),
    'pathchecker-eddsa-template.json'
  ),
```

```
http://localhost/sunbirdrc/keys/Ong.json
http://localhost/sunbirdrc/schema_templates/Ong.json
```
