import React, { Component } from 'react';
import './Today.css';
import axios from 'axios';
import Pusher from 'pusher-js';

class Today extends Component {
	state = {
		btcprice: '',
		ltcprice: '',
		ethprice: ''
	};

	sendPricePusher (data) {
	   axios.post('/prices/new', {
	       prices: data
	   })
	     .then(response => {
	    	//console.log(response)
	        
			let dataObj = JSON.parse(response.config.data)
			// we update the state with the current prices 
			this.setState({ btcprice: dataObj.prices.BTC.USD });
		   	this.setState({ ethprice: dataObj.prices.ETH.USD });
		   	this.setState({ ltcprice: dataObj.prices.LTC.USD });
			
	     })
	     .catch(error => {
	         console.log(error)
	     })
	}

	componentDidMount() {
		// establish a connection to Pusher
		//console.log(process.env.REACT_APP_KEY)
		this.pusher = new Pusher(process.env.REACT_APP_KEY, {
			cluster: 'eu',
			encrypted: true
		});
		// Subscribe to the 'coin-prices' channel
		this.prices = this.pusher.subscribe('coinwatch');
		axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
			.then(response => {
				// We set the latest prices in the state to the prices gotten from Cryptocurrency.
				this.setState({ 
					btcprice: response.data.BTC.USD,
					ethprice: response.data.ETH.USD,
					ltcprice: response.data.LTC.USD
				});
			})
			// Catch any error here
			.catch(error => {
				console.log(error)
			})

		this.cryptoSubscription = setInterval(() => {
			axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
				.then(response => {
					//console.log(response.data)
					this.sendPricePusher(response.data)
				})
				.catch(error => {
					console.log(error)
				})
		}, 10000);
		/* aint gat no idea what these guys are doint over here honestly.....lol
		// We bind to the 'prices' event and use the data in it (price information) to update the state values, thus, realtime changes 
		this.prices.bind('prices', price => {
			this.setState({ btcprice: price.prices.BTC.USD });
		   	this.setState({ ethprice: price.prices.ETH.USD });
		   	this.setState({ ltcprice: price.prices.LTC.USD });
		}, this);*/
	}

	componentWillUnmount() {
		clearInterval(this.cryptoSubscription);
	}

	render() {
		return (
			<div className="today--section container">
                <h2>Current Price</h2>
                <div className="columns today--section__box">
                    <div className="column btc--section">
                        <h5>${this.state.btcprice}</h5>
                        <p>1 BTC</p>
                    </div>
                    <div className="column eth--section">
                        <h5>${this.state.ethprice}</h5>
                        <p>1 ETH</p>
                    </div>
                    <div className="column ltc--section">
                        <h5>${this.state.ltcprice}</h5>
                        <p>1 LTC</p>
                    </div>
                </div>
            </div>
		)
	}
}

export default Today;