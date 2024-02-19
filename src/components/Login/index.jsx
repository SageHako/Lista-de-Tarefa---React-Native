import { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'


export default function Login({changeStatus}) {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[type, setType] = useState('login')


  async function handleLogin(){
    const auth = getAuth()
    if(type === 'login'){
        try{
          //faz o login    
          const credential = await signInWithEmailAndPassword(auth, email, password)
          changeStatus(credential.user.uid)
        }catch(error){
          alert('Erro ao fazer login')
          console.log(error)
        }            
        
    }else{
        //cadastra usuario
        const credential = await createUserWithEmailAndPassword(auth, email, password,)
        const userId = credential.user.uid
        setEmail('')
        setPassword('')
        alert('Conta criada!')
        changeStatus(userId)
      }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput 
        placeholder='Seu Email'
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}/>
      <TextInput 
        placeholder='***********'
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}/>

        <TouchableOpacity 
            style={[styles.handleLogin, {backgroundColor: type === 'login' ? '#3ea6f2' : '#141414'}]}
            onPress={handleLogin}>
            <Text style={styles.loginText}>
                {type === 'login' ? 'Acessar' : 'Cadastrar'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setType(type => type==='login' ? 'cadastrar' : 'login')}>
            <Text style={{textAlign: 'center'}}>
                {type === 'login' ? 'Criar uma conta': 'Ja possuo uma conta'}
            </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f2f6fc',
    paddingHorizontal: 10
  },
  input:{
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#141414'
  },
  handleLogin:{
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'center',
    height: 45,
    marginBottom: 10
  },
  loginText:{
    color: '#FFF',
    fontSize: 17
  }
});
