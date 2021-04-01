const Arweave = require('arweave');
const fetch = require("node-fetch");

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000
    
});


const tribusPostsOf = async(tribus_id) => {

    let name = null;
    let app = null;

    if (tribus_id === "null") {

        name = "public-square";
        app = "PublicSquare";

        const queryObject = {
      query: 
        `query {
  transactions(
    tags: [
        { name: "Content-Type", values: "text/plain" },
        { name: "App-Name", values: "${app}"},
        { name: "tribus-id", values: "${tribus_id}"},
        { name: "tribus-name", values: "${name}"},
        { name: "Type", values: "post"}
      
        ]

    first: 1000000

  ) {
    edges {
      node {
        id
      }
    }
  }
}
`,
    };

    const response = await fetch("https://arweave.net/graphql", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryObject),
    });

    const json = await response.json();
    const data_arr = [];

    const res_arr = json["data"]["transactions"]["edges"];

    for (element of res_arr) {
        const tx_obj = Object.values(element);
        const tx_id = (Object.values(tx_obj[0]));
        data_arr.push(tx_id[0])
    }

    return data_arr


    } else {

        const tribusesTxs = await getTribuses()

        if ( await isValidcXYZContract(tribus_id) ) {


            const valid_tribus_tx = await getValidTxOf(tribus_id);

            // return an empty array if the tribus has been created by a
            // different owner of the cXYZ PSC OR even not created yet
            if (! valid_tribus_tx) {
                return []
            };

            const valid_tribus_tx_obj = await arweave.transactions.get(valid_tribus_tx);


            const tags_list = await valid_tribus_tx_obj.get("tags");

            for (tag_pair of tags_list) {

                const key = tag_pair.get("name", {decode: true, string: true});
                const value = tag_pair.get("value", {decode: true, string: true});

                if (key == "tribus-name") {
                    name = value
                    app = "decent.land"
                };
            };

            const queryObject = {
      query: 
        `query {
  transactions(
    tags: [
        { name: "Content-Type", values: "text/plain" },
        { name: "App-Name", values: "${app}"},
        { name: "tribus-id", values: "${tribus_id}"},
        { name: "tribus-name", values: "${name}"},
        { name: "action", values: "post"}
      
        ]

    first: 1000000

  ) {
    edges {
      node {
        id
      }
    }
  }
}
`,
    };

    const response = await fetch("https://arweave.net/graphql", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryObject),
    });

    const json = await response.json();
    const data_arr = [];

    const res_arr = json["data"]["transactions"]["edges"];

    for (element of res_arr) {
        const tx_obj = Object.values(element);
        const tx_id = (Object.values(tx_obj[0]));
        data_arr.push(tx_id[0])
    }

    return data_arr

        }

    }

}




const getTribuses = async() => {

    const queryObject = {
      query: 
        `query {
  transactions(
    tags: [
        { name: "Content-Type", values: "application/json" },
        { name: "App-Name", values: "decent.land"},
        { name: "action", values: "createTribus"},
        { name: "version", values: "mainnet"}
      
        ]

    first: 1000000

  ) {
    edges {
      node {
        id
      }
    }
  }
}
`,
    };

    const response = await fetch("https://arweave.net/graphql", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryObject),
    });

    const json = await response.json();
   
    const data_arr = [];

    const res_arr = json["data"]["transactions"]["edges"];

    for (element of res_arr) {
        const tx_obj = Object.values(element);
        const tx_id = (Object.values(tx_obj[0]));
        data_arr.push(tx_id[0])
    }

    return data_arr
};



const profileHistory = async(address) => {

    if (typeof address !== "string") {
        throw new TypeError("Please provide wallet's address as string");
    };

    const queryObject = {
      query: 
        `query {
  transactions(
    tags: [
        { name: "Content-Type", values: "application/json" },
        { name: "App-Name", values: "decent.land"},
        { name: "action", values: "signup"},
        { name: "version", values: "0.0.1"}


      
    ]

    first: 1000000
    owners:["${address}"]

  ) {
    edges {
      node {
        id
      }
    }
  }
}
`,
    };

    const response = await fetch("https://arweave.net/graphql", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryObject),
    });

    const json = await response.json();

    const data_arr = [];

    const res_arr = json["data"]["transactions"]["edges"];

    for (element of res_arr) {
        const tx_obj = Object.values(element);
        const tx_id = (Object.values(tx_obj[0]));
        data_arr.push(tx_id[0])
    };
  
    const profile_his = [];

    if (data_arr.length > 0) {

        for (tx of data_arr){

            const registration_data =  await arweave.transactions.getData(tx,
            {
            decode: true, string: true
            });

            profile_his.push( JSON.parse(registration_data) );
        }

        
        return profile_his;

        } else {
            return []
            }

    };


const getTribusesObjects = async() => {
    const tribuses_objects_arrays = [];
    const tribusesTxs = await getTribuses();

    for (tribus_tx of tribusesTxs) {
        const tribus_holder = {};
        const tx_data = await arweave.transactions.getData(tribus_tx, {decode: true, string: true});
        const value = JSON.parse(tx_data)

        tribus_holder[String(tribus_tx)] = value
  
        tribuses_objects_arrays.push(tribus_holder)

    };

    return tribuses_objects_arrays
};




// ** HELPER FUNCTIONS ** //

const isValidcXYZContract = async(contract_id) => {
    const contract_tx = await arweave.transactions.get(contract_id);
    const tags_list = await contract_tx.get("tags");

    for (tag_pair of tags_list) {
        const key = tag_pair.get("name", {decode: true, string: true});
        const value = tag_pair.get("value", {decode: true, string: true});

        if (key == "Contract-Src" && value == "ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI") {
            return true
        }

    }

    return false

};

const getValidTxOf = async(tribus_id) => {
    const psc_creation_tx = await arweave.transactions.get(tribus_id);
    const psc_owner = psc_creation_tx["owner"];

    const tribusesObject = await getTribusesObjects();

    for (t_obj of tribusesObject) {

        const t_obj_creation_tx = Object.keys(t_obj)[0];
        
        const t_obj_creation_tx_ar_object = 
            await arweave.transactions.get(t_obj_creation_tx);

        const t_obj_creation_tx_owner = t_obj_creation_tx_ar_object["owner"]

        if (t_obj_creation_tx_owner == psc_owner) {
            return t_obj_creation_tx
        };
    }

    return null
    
};


module.exports = {tribusPostsOf, getTribuses, profileHistory, getTribusesObjects};
