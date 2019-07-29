<template>
  <div class="hello">
    <div v-if="isAuthenticated">
        <div class="navbar">
          <img :src="photoUrl" class="imageUser">
          <h3 class="displayName">{{name}}</h3>
          <button class="logoutButton" @click="logout">
            Log out
          </button>
          <Datatable @getAlltweets="getAllTweets" :show="show" :allData="allTweetsData"></Datatable>
        </div>
    </div>
    <div v-else>
       <button id="twitter-button" @click="login" class="logInbutton">Login With Twitter</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from './dataTable'
import io from 'socket.io-client'
var socket = io.connect('http://localhost:3000/')

export default {
  name: 'HelloWorld',
  components: { Datatable },
  data () {
    return {
      allTweetsData: [],
      show: true,
      isAuthenticated: false,
      user: null,
      token: '',
      name: '',
      photoUrl: '',
      myWindow: ''
    }
  },
  mounted () {
    socket.on('testsocket', (data) => {
      this.name = data.displayName
      this.photoUrl = data.photos[0].value
      this.isAuthenticated = true
      // this.getAllTweets()
    })
  },
  methods: {
    logout: function () {
      axios.get('http://localhost:3000/deleteAllTweet').then(r => {
        this.isAuthenticated = r.data
      })
    },
    login: function () {
      this.myWindow = window.open('http://localhost:3000/', '_blank', 'width=600, height=500')
    },
    getAllTweets: function () {
      this.myWindow.close()
      axios.get('http://localhost:3000/getAllTweet').then(r => {
        this.show = false
        this.allTweetsData = r.data
        console.log('allData', r)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imageUser {
  border-radius: 20px;
  position: absolute;
  top: 14px;
  right: 248px;
}
.logoutButton {
  height: 30px;
  width: 87px;
  border: none;
  position: absolute;
  top: 20px;
  right: 40px;
}
.navbar {
  display: inline-flex;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.displayName {
  position: absolute;
  top: 5px;
  right: 150px;
}
.logInbutton {
  width: 240px;
  height: 45px;
  font-size: 20px;
  color: wheat;
  background: royalblue;
}
</style>
