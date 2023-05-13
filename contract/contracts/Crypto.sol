// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;


contract Crypto {
    event Console(address a);

    // How to use example.
    function test(address signer, string memory seed, bytes memory signature) external {
        require(isValidSignature(signer, seed, signature), "Signature is not valid.");
    }

    // Store signatures
    // supply seed and wirhdraw

    function isValidSignature(address signer, string memory seedPhrase, bytes memory signature)
        // internal
        // view
        public
        returns (bool)
    {
        bytes32 message = prefixed(keccak256(abi.encodePacked(address(this), seedPhrase)));

        // check that the signature is from the payment sender
        address recoveredAddress = recoverSigner(message, signature);
        emit Console(recoveredAddress);
        emit Console(signer);
        return bool(recoveredAddress == signer);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65);

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    /// builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        //
    }
}
