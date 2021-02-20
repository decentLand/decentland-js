const Arweave = require('arweave');

const arweave = Arweave.init({
	host: 'arweave.net',
	port: 443,
	protocol: 'https',
	timeout: 20000
	
});


const getPsPostsTx = async () => {


	try {

		let posts = await arweave.arql({
			op: 'and',
			expr1: {
				op: 'equals',
				expr1: 'App-Name',
				expr2: 'PublicSquare',
			},

			expr2: {
				op: 'and',
				expr1: {
					op: 'equals',
					expr1: 'Content-Type',
					expr2: 'text/plain'
				},

				expr2: {
					op: 'and',
					expr1: {
						op: 'equals',
						expr1: 'Version',
						expr2: '1'
					},
					expr2: {
						op: 'and',
						expr1: {
							op: 'equals',
							expr1: 'protocol',
							expr2: 'decent.land'
						},
						expr2: {
							op: 'and',
							expr1: {
								op: 'equals',
								expr1: 'tribus-id',
								expr2: 'null'
							},
							expr2: {
								op: 'or',
								expr1: {
									op: 'equals',
									expr1: 'Type',
									expr2: 'post'
								},
								expr2: {
									op: 'equals',
									expr1: 'Type',
									expr2: 'post'
								}
							}
						}
					}
				}
			}
		})

		
		return posts
	} catch(err) {

		return err
	}


}

const getPsPosts = async () => {

	const posts = [];

	try {
		const posts_list = await getPostsTx();

		for (post_tx of posts_list) {
			const tx_status = await arweave.transactions.getStatus(post_tx)

			if (tx_status["status"] == 200) {
		

				const post_data = await arweave.transactions.getData(post_tx,
				{decode: true, string: true});
	
				const post_body = {};
				post_body["data"] = post_data;
				post_body["txID"] = post_tx;

				// decode tags
				const tx_data = await arweave.transactions.get(post_tx)
        		const tags = await tx_data.get('tags')

        		for (tag of tags) {
            		const key = tag.get("name", {decode: true, string: true})
            		const value = tag.get("value", {decode: true, string: true})
   
            		if (key == 'username' || key == 'user-id' || key == 'pfp' || key == 'unix-epoch' ) {

                	post_body[key.replace('-', '_')] = String(value)
                	

            		}


        		}

				
				posts.push(post_body)
			}


			
		} 
		return posts


	} catch(err) {
			return err
		}
	

}


const profile = async(address) => {
	if (typeof address !== "string") {
		throw new TypeError("Please provide wallet's address as string");
	}

	try {
		let profile = await arweave.arql(
		{
                op: 'and',
                expr1:
                    {
                        op: 'equals',
                        expr1: 'user-id',
                        expr2: address,
                    },
                
                expr2:
                    {
                      op: 'and',
                        expr1: 
                                {
                                    op: 'equals',
                                    expr1: 'App-Name',
                                    expr2: 'decent.land'
                                },

   
                        expr2:
                            {
                            op: 'and',
                              expr1:
                                
                                    {
                                        op:'equals',
                                        expr1: 'version',
                                        expr2: '0.0.1',
                                    },
                                
                                expr2:
                                    
                                    {
                                        op: 'and',
                                            expr1:

                                            {
                                                op:'equals',
                                                expr1: 'action',
                                                expr2: 'signup'
                                            },

                                            expr2:
                                                
                                                {
                                                    op: 'and',
                                                        expr1:

                                                        {
                                                            op: 'equals',
                                                            expr1: 'Content-Type',
                                                            expr2: 'application/json',
                                                        },

                                                        expr2:
                                                        
                                                        {
                                                            op: 'equals',
                                                            expr1: 'from',
                                                            expr2: address,
                                                        },
                                                },
                                    },

                            },
                    },

            });

	if (profile.length > 0) {
		const last_tx_update = profile[0]
		const update_data = await arweave.transactions.getData(last_tx_update, {
			decode: true, string: true
		});

		
		return JSON.parse(update_data)
	} else {
		return {}
	}

	} catch(err) {
		return err
	}
            
}


module.exports = {getPsPosts, getPsPostsTx, profile}
