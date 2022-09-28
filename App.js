import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);
  const db = SQLite.openDatabase('itemdatabase');
  //initial creation of the table
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists itemtable (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  //save new by pressing the button
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into itemtable (product, amount) values (?, ?);',
        [product, amount]);

    }, null, updateList
    )
    setProduct('');
    setAmount('');
  
  }
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from itemtable;', [], (_, { rows }) =>
        setItems(rows._array)
      );
    });
    console.log(items)
  }
  //delete item
  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from itemtable where id =?;`, [id]);
    }, null, updateList
    )
  }


  return (
    <View style={styles.container}>
      <View style={{ flex: 0, justifyContent: 'flex-end', marginTop:100 }}>
        <TextInput style={{ width: 200, height:40, borderColor: 'black', borderWidth: 1, marginBottom: 10, textAlign: 'center' }} placeholder='Product'
          onChangeText={(product) => setProduct(product)}value={product} 
        />
        <TextInput style={{ width: 200, height: 40, borderColor: 'black', borderWidth: 1, marginBottom: 10, textAlign: 'center' }} placeholder='Amount'
          onChangeText={amount => setAmount(amount)} value={amount}  keyboardType='n'
        />
      </View>
      <View style={{ flex: 0, height: 40,  justifyContent: 'flex-start', marginTop:10 }}>
        <Button title='save' onPress={saveItem} />
      </View>

      <View style={{ flex: 0, alignContent:'center', marginTop:20, marginBottom:20 }}>
        <Text style={{ fontWeight: 'bold', fontSize:20}}>Shopping list</Text>
      </View>
      <FlatList
       keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => 
        <View style={{flex:0.8, fontSize: 12, color:'black', flexDirection:'row', alignItems:'center', justifyContent: 'flex-start', marginBottom:10 }}>
          <Text style={{ color:'black', marginRight:15, fontSize:18 }}>{item.product} {item.amount}</Text>
          <Text style={{  color: '#0000ff', fontSize:18 }} onPress={() => deleteItem(item.id)}> DONE</Text>
          </View>}
        data={items}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
