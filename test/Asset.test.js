const Asset = artifacts.require("Asset");
require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Asset',(accounts)=>{

  before(async () => {
    asset = await Asset.deployed();
  });
    //write out my test
    let asset;
    describe('deployment', async() => {
      it('deploys', async () => {

        const address = asset.address;
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, undefined);
      });
    });
    describe('storage', async () => {
      it('updates the hash', async () => {
        let assetHash = "1234";
        await asset.set(assetHash);
        const result= await asset.get();
        assert.equal(result , assetHash);
      });
    });
});
