pragma solidity >=0.4.21 ;

contract Asset {
  string assetHash;
  function set(string memory _assetHash) public {
    assetHash=_assetHash;
  }
  function get() public view returns(string memory){
    return assetHash;
  }
}
