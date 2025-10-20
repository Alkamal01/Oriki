"""
IPFS Client - Decentralized storage interface
For demo, simulates IPFS. Production would use ipfshttpclient
"""
import json
import hashlib
from typing import Dict, Any

class IPFSClient:
    def __init__(self):
        # Simulated IPFS storage for demo
        self.storage = {}
        
    async def add_json(self, data: Dict[str, Any]) -> str:
        """Add JSON data to IPFS and return hash"""
        # Simulate IPFS hash generation
        content = json.dumps(data, sort_keys=True)
        ipfs_hash = "Qm" + hashlib.sha256(content.encode()).hexdigest()[:44]
        
        # Store in simulated IPFS
        self.storage[ipfs_hash] = data
        
        return ipfs_hash
    
    async def get_json(self, ipfs_hash: str) -> Dict[str, Any]:
        """Retrieve JSON data from IPFS"""
        return self.storage.get(ipfs_hash, {})
    
    async def check_health(self) -> bool:
        """Health check"""
        return True
    
    def get_gateway_url(self, ipfs_hash: str) -> str:
        """Get public gateway URL for IPFS content"""
        return f"https://ipfs.io/ipfs/{ipfs_hash}"
