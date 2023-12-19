---
permalink: /crypto/
group: reference
layout: default
title: "Crypto"
fa-icon: fa-lock
priority: 950
---

Krypto is a cryptography library for Multiplatform Kotlin.


## SecureRandom

Krypto provides a `SecureRandom` object that extends the `kotlin.random.Random` class,
but it generates cryptographic secure values. It is a singleton, and you cannot provide an initial seed.

Instead of a pseudo-random and reproducible, its result values are fully random,
making it suitable for cryptographic purposes, and not suitable for reproductible results.

It uses `SecureRandom` on the JVM + [`PRNGFixes`](https://android-developers.googleblog.com/2013/08/some-securerandom-thoughts.html){:target="_blank",:rel="noopener"} on Android.
On Native POSIX (including Linux, macOS and iOS), it uses `/dev/urandom`, on Windows
[`BCryptGenRandom`](https://docs.microsoft.com/en-us/windows/desktop/api/bcrypt/nf-bcrypt-bcryptgenrandom){:target="_blank",:rel="noopener"}

### Using the SecureRandom instance

Since it is an object, you can use it directly as a `Random` instance:

```kotlin
val random: Random = SecureRandom
```

### Seeding extra bytes

In addition to the standard kotlin `Random` interface, SecureRandom provides a method for seeding extra random bytes.

```kotlin
val bytes = byteArrayOf(1, 2, 3)
SecureRandom.addSeed(bytes)
```

## Hash (MD4/MD5/SHA1/SHA256/SHA512)

Korlibs crypto supports hashing byte arrays, and synchronous and asynchronous streams for different algorithms in an extensible fashion.

There are a few predefined hashing methods available out of the box:

```kotlin
object MD4 : HasherFactory
object MD5 : HasherFactory
object SHA1 : HasherFactory
object SHA256 : HasherFactory
object SHA512 : HasherFactory
```

Then you can hash different binary sources like `ByteArray`, `AsyncInputStream`, `AsyncOpenableStream` or a `SyncInputStream`:

```kotlin
// Synchronous hashing
fun ByteArray.hash(algo: HashFactory): Hash
fun SyncInputStream.hash(algo: HasherFactory): Hash 

// Asynchronous hashing
suspend fun AsyncInputOpenable.hash(algo: HasherFactory): Hash
suspend fun AsyncInputStream.hash(algo: HasherFactory): Hash

// In the JVM:
fun InputStream.hash(algo: HasherFactory): Hash
```

So for example, to get the hex representation of a SHA1 hash for the bytes `1, 2, 3` you would:

```kotlin
println(byteArrayOf(1, 2, 3).hash(SHA1).hex)
```

There are shortcuts for the out of the box provided `HashFactory`:
```kotlin
fun ByteArray.md4(): Hash
fun ByteArray.md5(): Hash
fun ByteArray.sha1(): Hash
fun ByteArray.sha256(): Hash
fun ByteArray.sha512(): Hash
```

The `HasherFactory` looks like this:

```kotlin
open class HasherFactory() {
    operator fun invoke(): Hasher
}

// Shortcuts to digest from it
fun HasherFactory.digest(data: ByteArray): Hash
inline fun HasherFactory.digest(readBytes: (data: ByteArray) -> Int): Hash
```

Then the `Hasher` class looks like this:

```kotlin
abstract class Hasher(val chunkSize: Int, val digestSize: Int, val name: String) {
	open fun reset(): Hasher
	open fun update(data: ByteArray, offset: Int, count: Int): Hasher
	open fun digestOut(out: ByteArray)
	fun update(data: ByteArray)
	fun digest(): Hash
}
```
### Getting raw, hex or base64 representations from a `Hash` instance

From a Hash class, it is possible to get it's raw bytes, or the hexadecimal or base64 representations:

```kotlin
println(hash.bytes.toList())
println(hash.base64)
println(hash.base64Url)
println(hash.hex)
println(hash.hexLower)
println(hash.hexUpper)
```

```kotlin
class Hash {  
	constructor(bytes: ByteArray)

    companion object {  
        fun fromHex(hex: String): Hash
        fun fromBase64(base64: String): Hash
    }
    
    val bytes: ByteArray
    val base64: String
    val base64Url: String
    val hex: String
    val hexLower: String
    val hexUpper: String
}
```

## HMAC

## PBKDF2

## AES

```kotlin
object AES {
    fun decryptAes128Cbc(encryptedMessage: ByteArray, cipherKey: ByteArray): ByteArray
    fun encryptEes128Cbc(plainMessage: ByteArray, cipherKey: ByteArray): ByteArray
}
```
