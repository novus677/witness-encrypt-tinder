import React, { useState, useEffect } from 'react';
import * as we from '../wasm/witness_encryption_functional_commitment.js';

const TestPage = () => {
    const [wasmLoaded, setWasmLoaded] = useState(false);
    const [commitValue, setCommitValue] = useState(0);

    const handleCommitValue = (event) => {
        setCommitValue(event.target.value);
    };

    useEffect(() => {
        const loadWasm = async () => {
            await we.default();
            setWasmLoaded(true);
        }
        loadWasm();
    }, []);

    useEffect(() => {
        try {
            if (!localStorage.getItem('setupParams')) {
                const params = we.setup_unsafe();
                localStorage.setItem('setupParams', JSON.stringify(params));
                console.log("Parameters stored in localStorage");
            } else {
                console.log("Parameters already in localStorage");
            }
        } catch (err) {
            console.error("Failed to load setup parameters:", err);
        }

    }, [wasmLoaded]);

    const handleCommit = async () => {
        if (!wasmLoaded) {
            console.error("WASM not loaded");
        }

        try {
            const params = JSON.parse(localStorage.getItem('setupParams'));
            const commitment = we.commit(params["u1_bytes"], params["u2_bytes"], commitValue);
            localStorage.setItem('commitment', JSON.stringify(commitment));
            console.log("Commitment stored in localStorage");
        } catch (err) {
            console.error("Failed to compute commitment:", err);
        }
    };

    return (
        <div>
            <h1>buffer</h1>
            <input type="text" value={commitValue} onChange={handleCommitValue} />
            <button onClick={handleCommit}>Commit</button>
        </div>
    );
}

export default TestPage;
