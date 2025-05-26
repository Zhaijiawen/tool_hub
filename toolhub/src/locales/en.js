export default {
  common: {
    format: 'Format',
    encrypt: 'Encrypt',
    convert: 'Convert',
    image: 'Image',
    text: 'Text',
    other: 'Other',
    copy: 'Copy',
    success: 'Success',
    error: 'Error',
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    required: 'Required',
    more: 'More',
    theme: {
      light: 'Light',
      dark: 'Dark'
    },
    enableHighlight: 'Enable Code Highlighting',
    copySuccess: 'Copy Success',
    copyError: 'Copy Failed'
  },
  format: {
    json: {
      title: 'JSON Formatter',
      placeholder: 'Enter JSON data',
      format: 'Format',
      compress: 'Compress',
      escape: 'Escape',
      unescape: 'Unescape',
      description: 'Format JSON data with compression and beautification'
    },
    xml: {
      title: 'XML Formatter',
      placeholder: 'Enter XML data',
      format: 'Format',
      compress: 'Compress',
      description: 'Format XML data with compression and beautification'
    },
    kotlin: {
      title: 'Kotlin Formatter',
      placeholder: 'Enter Kotlin code',
      format: 'Format'
    },
    rust: {
      title: 'Rust Formatter',
      placeholder: 'Enter Rust code',
      format: 'Format'
    },
    shell: {
      title: 'Shell/Bash Formatter',
      placeholder: 'Enter Shell/Bash script',
      format: 'Format'
    },
    sql: {
      title: 'SQL Formatter',
      placeholder: 'Enter SQL query',
      format: 'Format'
    },
    markdown: {
      title: 'Markdown Formatter',
      placeholder: 'Enter Markdown text',
      format: 'Format'
    },
    dart: {
      title: 'Dart Formatter',
      placeholder: 'Enter Dart code',
      format: 'Format'
    },
    yaml: {
      title: 'YAML Formatter',
      description: 'Format YAML data with compression and beautification'
    }
  },
  encrypt: {
    aes: {
      title: 'AES Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      key: 'Key',
      keyPlaceholder: 'Enter key',
      keyRequired: 'Key is required',
      iv: 'IV',
      ivPlaceholder: 'Enter IV (optional)',
      mode: 'Encryption Mode',
      modePlaceholder: 'Select encryption mode',
      padding: 'Padding',
      paddingPlaceholder: 'Select padding method',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt'
    },
    chacha20: {
      title: 'ChaCha20 Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      key: 'Key',
      keyPlaceholder: 'Enter key',
      keyRequired: 'Key is required',
      nonce: 'Nonce',
      noncePlaceholder: 'Enter nonce',
      nonceRequired: 'Nonce is required',
      counter: 'Counter',
      counterPlaceholder: 'Enter counter value',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt'
    },
    des: {
      title: 'DES/3DES Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      key: 'Key',
      keyPlaceholder: 'Enter key',
      keyRequired: 'Please enter key',
      iv: 'Initialization Vector',
      ivPlaceholder: 'Enter initialization vector (optional)',
      mode: 'Encryption Mode',
      modePlaceholder: 'Select encryption mode',
      type: 'Encryption Type',
      typePlaceholder: 'Select encryption type',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt'
    },
    rsa: {
      title: 'RSA Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key',
      publicKeyRequired: 'Please enter public key',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key',
      privateKeyRequired: 'Please enter private key',
      keySize: 'Key Size',
      keySizePlaceholder: 'Select key size',
      generateKeyPair: 'Generate Key Pair',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt',
      encryptionFailed: 'Encryption failed',
      decryptionFailed: 'Decryption failed'
    },
    ecc: {
      title: 'ECC Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key',
      publicKeyRequired: 'Please enter public key',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key',
      privateKeyRequired: 'Please enter private key',
      curve: 'Curve',
      curvePlaceholder: 'Select curve',
      generateKeyPair: 'Generate Key Pair',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt'
    },
    ed25519: {
      title: 'Ed25519 Encryption/Decryption',
      inputPlaceholder: 'Enter content to encrypt/decrypt',
      outputPlaceholder: 'Encryption/decryption result will appear here',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key',
      publicKeyRequired: 'Please enter public key',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key',
      privateKeyRequired: 'Please enter private key',
      generateKeyPair: 'Generate Key Pair',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt',
      verificationSuccess: 'Verification successful',
      verificationFailed: 'Verification failed'
    },
    ed25519Sign: {
      title: 'Ed25519 Signature',
      inputPlaceholder: 'Enter text to sign',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key',
      generateKeyPair: 'Generate Key Pair',
      sign: 'Sign',
      verify: 'Verify',
      outputPlaceholder: 'Signature or verification result will appear here',
      privateKeyRequired: 'Please enter private key',
      publicKeyRequired: 'Please enter public key',
      verificationSuccess: 'Verification successful',
      verificationFailed: 'Verification failed'
    },
    sha: {
      title: 'SHA Hash Algorithm',
      inputPlaceholder: 'Enter content to calculate hash',
      outputPlaceholder: 'Hash result will appear here',
      algorithm: 'Algorithm',
      algorithmPlaceholder: 'Select hash algorithm',
      outputFormat: 'Output Format',
      outputFormatPlaceholder: 'Select output format',
      hash: 'Calculate Hash',
      inputRequired: 'Please enter content to calculate hash',
      invalidAlgorithm: 'Invalid hash algorithm'
    },
    bcrypt: {
      title: 'Bcrypt Hash Algorithm',
      inputPlaceholder: 'Enter content to calculate hash',
      outputPlaceholder: 'Hash result will appear here',
      saltRounds: 'Salt Rounds',
      saltRoundsPlaceholder: 'Enter salt rounds (4-31)',
      hash: 'Calculate Hash',
      verify: 'Verify Hash',
      inputRequired: 'Please enter content to calculate hash',
      bothInputsRequired: 'Please enter content and hash to verify',
      verificationSuccess: 'Verification successful',
      verificationFailed: 'Verification failed'
    },
    argon2: {
      title: 'Argon2 Hash Algorithm',
      inputPlaceholder: 'Enter content to calculate hash',
      outputPlaceholder: 'Hash result will appear here',
      type: 'Type',
      typePlaceholder: 'Select Argon2 type',
      memoryCost: 'Memory Cost',
      memoryCostPlaceholder: 'Enter memory cost (1-65536)',
      timeCost: 'Time Cost',
      timeCostPlaceholder: 'Enter time cost (1-100)',
      parallelism: 'Parallelism',
      parallelismPlaceholder: 'Enter parallelism (1-32)',
      hash: 'Calculate Hash',
      verify: 'Verify Hash',
      inputRequired: 'Please enter content to calculate hash',
      bothInputsRequired: 'Please enter content and hash to verify',
      verificationSuccess: 'Verification successful',
      verificationFailed: 'Verification failed'
    },
    base64: {
      title: 'Base64 Encode/Decode',
      inputPlaceholder: 'Enter content to encode/decode',
      outputPlaceholder: 'Encoded/decoded result will appear here',
      operation: 'Operation',
      operationPlaceholder: 'Select operation type',
      encode: 'Encode',
      decode: 'Decode',
      process: 'Process',
      inputRequired: 'Please enter content to process'
    },
    hex: {
      title: 'Hex Encode/Decode',
      inputPlaceholder: 'Enter content to encode/decode',
      outputPlaceholder: 'Encoded/decoded result will appear here',
      operation: 'Operation',
      operationPlaceholder: 'Select operation type',
      encode: 'Encode',
      decode: 'Decode',
      process: 'Process',
      inputRequired: 'Please enter content to process',
      invalidHex: 'Invalid hex string'
    },
    url: {
      title: 'URL Encode/Decode',
      inputPlaceholder: 'Enter content to encode/decode',
      outputPlaceholder: 'Encoded/decoded result will appear here',
      operation: 'Operation',
      operationPlaceholder: 'Select operation type',
      encode: 'Encode',
      decode: 'Decode',
      process: 'Process',
      inputRequired: 'Please enter content to process'
    },
    html: {
      title: 'HTML Encode/Decode',
      inputPlaceholder: 'Enter content to encode/decode',
      outputPlaceholder: 'Encoded/decoded result will appear here',
      operation: 'Operation',
      operationPlaceholder: 'Select operation type',
      encode: 'Encode',
      decode: 'Decode',
      process: 'Process',
      inputRequired: 'Please enter content to process'
    },
    jwt: {
      title: 'JWT Encode/Decode',
      inputPlaceholder: 'Enter content to encode/decode',
      outputPlaceholder: 'Encoded/decoded result will appear here',
      operation: 'Operation',
      operationPlaceholder: 'Select operation type',
      encode: 'Encode',
      decode: 'Decode',
      process: 'Process',
      secret: 'Secret',
      secretPlaceholder: 'Enter secret',
      secretRequired: 'Please enter secret',
      algorithm: 'Algorithm',
      algorithmPlaceholder: 'Select algorithm',
      inputRequired: 'Please enter content to process'
    },
    diffieHellman: {
      title: 'Diffie-Hellman Key Exchange',
      prime: 'Prime',
      primePlaceholder: 'Enter prime number (hex)',
      generator: 'Generator',
      generatorPlaceholder: 'Enter generator (hex)',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key (hex)',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key (hex)',
      generateKeyPair: 'Generate Key Pair',
      computeSharedSecret: 'Compute Shared Secret',
      outputPlaceholder: 'Shared secret will appear here',
      primeAndGeneratorRequired: 'Please enter prime and generator',
      allFieldsRequired: 'Please fill in all fields'
    },
    ecdh: {
      title: 'ECDH Key Exchange',
      curve: 'Curve',
      curvePlaceholder: 'Select elliptic curve',
      privateKey: 'Private Key',
      privateKeyPlaceholder: 'Enter private key (hex)',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Enter public key (hex)',
      generateKeyPair: 'Generate Key Pair',
      computeSharedSecret: 'Compute Shared Secret',
      outputPlaceholder: 'Shared secret will appear here',
      allFieldsRequired: 'Please fill in all fields'
    }
  },
  convert: {
    timestamp: {
      title: 'Timestamp Converter',
      current: 'Current Timestamp',
      timestamp: 'Timestamp',
      date: 'Date',
      timezone: 'Timezone',
      result: 'Result',
      unit: {
        second: 'Second',
        millisecond: 'Millisecond'
      }
    }
  },
  image: {
    compress: {
      title: 'Image Compression',
      upload: 'Upload Image',
      quality: 'Quality',
      size: 'File Size',
      format: 'Output Format'
    }
  },
  text: {
    case: {
      title: 'Case Converter',
      inputPlaceholder: 'Enter text to convert',
      outputPlaceholder: 'Converted result will appear here',
      uppercase: 'UPPERCASE',
      lowercase: 'lowercase',
      capitalize: 'Capitalize',
      inputRequired: 'Please enter text to convert'
    },
    reverse: {
      title: 'Text Reverser',
      inputPlaceholder: 'Enter text to reverse',
      outputPlaceholder: 'Reversed result will appear here',
      reverse: 'Reverse',
      inputRequired: 'Please enter text to reverse'
    },
    whitespace: {
      title: 'Whitespace Handler',
      inputPlaceholder: 'Enter text to process',
      outputPlaceholder: 'Processed result will appear here',
      trim: 'Trim Whitespace',
      compress: 'Compress Whitespace',
      inputRequired: 'Please enter text to process'
    },
    replace: {
      title: 'Text Replacer',
      inputPlaceholder: 'Enter text to replace',
      outputPlaceholder: 'Replaced result will appear here',
      from: 'Replace',
      fromPlaceholder: 'Enter text to replace',
      to: 'Replace with',
      toPlaceholder: 'Enter replacement text',
      replace: 'Replace',
      newlineToComma: 'Newline to Comma',
      commaToNewline: 'Comma to Newline',
      inputRequired: 'Please enter text to replace',
      fromRequired: 'Please enter text to replace'
    }
  },
  other: {
    qrcode: {
      title: 'QR Code Generator',
      content: 'Content',
      size: 'Size',
      level: 'Error Correction Level'
    }
  }
} 