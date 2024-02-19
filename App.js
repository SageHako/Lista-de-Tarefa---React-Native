import { useEffect, useRef, useState } from 'react';
import {Keyboard ,StyleSheet, FlatList, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Login from './src/components/Login';
import TaskList from './src/components/Tasklist'
import Feather from 'react-native-vector-icons/Feather'

import {child, getDatabase, off, onValue, push, ref, remove, set, update} from 'firebase/database'
import { database } from './src/services/firebaseConnection'

export default function App() {
  const[user, setUser] = useState(null)
  const[newTask, setNewTask] = useState('')
  const[tasks, setTasks] = useState([])
  const[key, setKey] = useState('')
  const inputRef = useRef(null)

  useEffect(()=>{
    function getUser(){
      if(!user){
        return
      }
      const db = getDatabase()
      const userTaskRef = ref(db, `tarefas/${user}`)
      
      const userList = onValue(userTaskRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convertendo o objeto em um array de objetos
          const userListData = Object.entries(data).map(([key, value]) => ({
            key,
            nome: value.nome,
          }));
          setTasks(userListData);
        }
      });
    }
    getUser()
  }, [user])

  async function handleAdd(){
    //referenciando o banco do firebase
    const db = getDatabase()
    const userTaskRef = ref(db, `tarefas/${user}`)

    if(newTask === ''){
      return
    }

    //editando uma tarefa
    if(key !== '' ){
      await update(child(userTaskRef, key), {
        nome: newTask
      }).then(()=>{
        console.log('Atualizado')
      })

      Keyboard.dismiss()
      setNewTask('')
      setKey('')
      return
    }

    //adicionando tarefa no banco
    try{
      const taskKey = await push(userTaskRef, {
        nome: newTask
      }).then( ()=>{
        const datalist = {
          key: taskKey.key,
          nome: newTask
        }
        setTasks(oldTasks => [...oldTasks, datalist])
      })      
      setNewTask('')
      Keyboard.dismiss()

    }catch(error){
      console.log(error)
    }
  }

  function handleDelete(key){
    const db = getDatabase()
    const userTaskRef = ref(db, `tarefas/${user}`)

    remove(child(userTaskRef, key))
    .then( () => {
      console.log('item removido')
    })
    .catch((e) =>{
      console.log('Erro ao deletar')
    })
  }

  function handleEdit(data){
    setKey(data.key)
    console.log(key)
    setNewTask(data.nome)
    inputRef.current.focus()
  }

  if(!user){
    return <Login changeStatus={(user)=>setUser(user)}/>
  }

  function cancelEdit(){
    setKey('')
    setNewTask('')
    Keyboard.dismiss()
  }
  return(
    <SafeAreaView style={styles.container}>

    {key.length > 0 && (
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name='x-circle' size={20} color='#ff0000'/>
          </TouchableOpacity> 
        <Text style={{marginLeft: 5, color: '#ff0000'}}>
          Voce está editando uma tarefa!
        </Text>
      </View>
    )}

      <View style={styles.containerTask}>
        <TextInput 
          style={styles.input}
          placeholder='qual sua tarefa?'
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}/>

          <TouchableOpacity 
            style={styles.buttonAdd}
            onPress={handleAdd}>
            <Text style={{color: '#fff', fontSize: 28}}>+</Text>
          </TouchableOpacity>
      </View>

      <FlatList 
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({item})=>(
          <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit}/>
        )}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  },
  containerTask:{
    flexDirection: 'row'
  },
  input:{
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  buttonAdd:{
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4    
  },
  buttonText:{
    color: '#fff',
    fontSize: 22
  }
});
