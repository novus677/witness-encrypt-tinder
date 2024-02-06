# Oblivious: Matching with Witness Encryption

Perform Tinder-like matching such that nobody learns anything, apart from their own matches. Check out [the website](https://oblivious-site.onrender.com)!

As far as I am aware, this is the first application of a (possibly) secure [witness encryption scheme](https://eprint.iacr.org/2022/1510). There is also [this repository](https://github.com/guberti/witness-encryption-demos) which encrypts a Bitcoin wallet using a Sudoku puzzle, but it relies on the CLT13 multilinear map, which is known to be insecure against the zeroizing attack.

Thanks to [Divide-By-0](https://github.com/Divide-By-0/ideas-for-projects-people-would-use) for the idea!

## How to use
- Register an account
- Create a new group and add your friends (or have someone else create a group and have them add you)
- Heart all the people in your group that you're interested in (and then hit *Done*)
- Once everyone has chosen who they are interested in, hit *Match!* to encrypt all your choices and send them out
- Finally, reveal to see who you matched with!

## How it works

### Disclaimer
This kind of Tinder matching (where nobody learns anything apart from their own matches) is already possible using basic MPC techniques (you could just pairwise apply an [oblivious transfer](https://en.wikipedia.org/wiki/Oblivious_transfer)). The interesting part of using witness encryption is that it introduces a sense of "non-interactivity," i.e., after everyone has committed to their matches, there is no required interaction between users.

This application features a centralized server that holds a database of encrypted messages so that users can easily query for their own messages (so that users do not need to be always online). For a proper setup, one would use peer-to-peer communication to avoid possible censorship. Also, for the purposes of this MVP, the trusted setup parameters for the witness encryption scheme are hardcoded into the server.

The application will store who you hearted (and the corresponding witness) in local storage. This is so that it can remember after you log out. If you really care, you would have to run everything locally and send your commitments and encrypted messages to the server/ other users.

### Witness encryption for succinct functional commitments

A [recent paper](https://eprint.iacr.org/2022/1510) introduced a new implementation for witness encryption specifically over a small class of functional commitments. One encrypts with respect to a triple $(\textsf{cm}, G, y)$, where $\textsf{cm}$ is a succinct commitment to $v$ such that $G(v)=y$. Anyone with a succinct opening proof can decrypt the ciphertext. We forked an [existing code implementation](https://github.com/vicsn/witness-encryption-functional-commitment) and cleaned up some of the code. Our fork can be found [here](https://github.com/novus677/witness-encryption-functional-commitment). Note that the code implementation only supports linear $G$.

Here is how we actually use this witness encryption scheme to perform matching. 
1. In the first stage, each user commits to their matches. In particular, if X likes Y, then X computes $\textsf{cm}=\textsf{commit}(pk_{\text{Y}}; r)$ and publishes $\textsf{cm}$ (suppose $pk_{\text{Y}}$ is the Y's public key, Y's name, etc.).
2. In the second stage, each user will send a list of encrypted messages to every other user. For example, consider Y sending messages to X. Each message will have the same content: the singular bit indicating whether or not Y likes X, however, she will encrypt this message multiple times, one for each commitment that X posted. 

    For each commitment $\textsf{cm}$ that X posted, Y will encrypt her message with the triple $(\textsf{cm}, \text{id}, pk_{\text{Y}})$. Note that here, $G$ is chosen as the identity function. Now, X can only decrypt the message if he knows randomness $r$ such that $\textsf{cm}=\textsf{commit}(pk_{\text{Y}}; r)$. If X did indeed commit to Y, then he will be able to decrypt one of Y's messages and learn whether or not they match. Otherwise, X cannot decrypt any messages and learns nothing.

Note that in this process, Y was able to encrypt her own messages *despite* not knowing an opening proof to the commitment. This is the real power behind witness encryption, and it allows us to extend beyond the reach of vanilla zk proofs.
