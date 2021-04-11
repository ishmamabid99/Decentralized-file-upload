import React, { Component } from 'react';
import Web3 from 'web3'
import Asset from '../abis/Asset.json';
import './App.css';


var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {
  protocol: 'https'
})
class App extends Component {
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadBlockchainData(){
    const web3= window.web3;
    const accounts  = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const networkId =  await web3.eth.net.getId();
    const networkData = Asset.networks[networkId];
    console.log(networkData);
    if(networkData){
      const abi = Asset.abi;
      const address = networkData.address;
      const contract= web3.eth.Contract(abi,address);
      this.setState({contract});
      const assetHash = await contract.methods.get().call();
      this.setState({assetHash});
      console.log(contract);
    }
    else{
      alert('Smart contract not deployed');
    }
  }
  constructor(props){
    super(props);
    this.state={
      account: "",
      buffer:null,
      contract:null,
      assetHash:'QmT4Yq71KLfXVe1ZuaPA4a8JA4adsunogDQHfuSoYbiMVV'
    };
  }
  async loadWeb3 (){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert('please use Chrome metamask extention!')
    }
  }
  captureFile=(event)=>{
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = ()=>{

      this.setState({buffer:Buffer(reader.result)})
    }
  }
  onSubmit=(event)=>{
    event.preventDefault();
    ipfs.add(this.state.buffer,(err ,res)=>{

        if(err){
           console.log(err);
           return;
         }
         else{
           const assetHash = res[0].hash;
           this.state.contract.methods.set(assetHash).send({from :this.state.account})
           .then((r) => {
             this.setState({assetHash});
           });
         }
    });
    console.log("Submitting the form");
  }
  render() {
    return (
      <div>

        <header>
          <a href="/"><h1>Dapp File </h1></a>
          <h1 className ="account">{this.state.account}</h1>
        </header>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  <img src={`https://ipfs.io/ipfs/${this.state.assetHash}`} />
                  <p>&nbsp;</p>
                  <h2>IPFS upload</h2>
                  <form onSubmit = {this.onSubmit}>
                    <input type ="file" placeholder="choose a file" onChange= {this.captureFile}/>
                    <button type ="submit">add</button>
                  </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
