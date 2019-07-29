<template>
  <div>
    <button class="showAll" v-if="show" @click="getAlltweets">Show me my all Tweets</button>
    <div class="wrapAllTable" v-else>
      <div class="box">
        <!-- search with icon start here -->
        <div class="input-group searchgroup">
          <input id="input-icon-left" placeholder="Search" name="input-icon-left" style="border: 0px;" v-model="search" required/>
        </div>
      </div>
      <!-- table part start here -->
      <div style="margin-top: 30px" class="parentTable">
        <table style="width: 100%">
          <!-- table heading start here -->
          <tr class="parentThHeading">
            <th v-for="(field, k) in tableFields" :style="{width: width+'%'}" :key="k" class="capitalize">{{field}}</th>
          </tr>
          <!-- table heading end here -->
          <div style="width: 100%; height: 20px"></div>
          <!-- table body start here -->
          <tr v-for = "(x, n) in dataPerPage" :key="n">
            <td v-for="(field, k) in tableFields" :key="k" :style="{width: width+'%'}">{{formData(field,x[field])}}</td>
          </tr>
          <!-- table body end here -->
        </table>
      </div>
      <!-- table part end here -->
      <!-- paginatation start here -->
      <div class="paginatation">
        <span @click="setPage(currentPageIndex-1)" class="buttonsnp" style="border-radius: 40px 0px 0px 40px; margin-right: -3px;">Prev</span>
        <span v-for="i in pages" @click="setPage(i - 1)" :key="i" v-bind:class="{'current': (currentPageIndex + 1) === i}" class="buttonn">{{i}}</span>
        <span @click="setPage(currentPageIndex+1)" class="buttonsnp" style="border-radius: 0px 40px 40px 0px; margin-left: -3px;">Next</span>
      </div>
      <!-- paginatation end here -->
    </div>
  </div>
</template>

<script>
import {_} from 'vue-underscore'
export default {
  name: 'Datatable',
  props: {
    show: {default: true},
    allData: {}
  },
  data () {
    return {
      paginationPath: '',
      itemsPerPage: 10,
      id: '',
      entityData: '',
      editForm: false,
      dataList: false,
      perpage: 10,
      currentPageIndex: 0,
      search: '',
      companyData: '',
      tableFields: {
        Name: 'name',
        text: 'text',
        location: 'location',
        hashTag: 'hashTag'
      }
    }
  },
  computed: {
    // get width to the all column
    width: function () {
      var x = _.keys(this.tableFields).length + 1
      return 100 / x
    },
    // caclculate for pagination page no and return value for showing page no
    pages: function () {
      var filteredData = this.filteredData
      var x = Math.ceil(filteredData.length / this.perpage)
      var arr = []
      for (var i = 1; i <= x; i++) {
        arr.push(i)
      }
      if (arr.slice(this.currentPageIndex, this.currentPageIndex + 10).length < 10) {
        // var remainPagination = arr.slice(this.currentPageIndex, this.currentPageIndex + 10).length
        return arr.slice(x - 10, x + 1)
      } else {
        return arr.slice(this.currentPageIndex, this.currentPageIndex + 10)
      }
      // return arr.slice(this.currentPageIndex , this.currentPageIndex + 10)
    },
    // calculate data per page
    dataPerPage: function () {
      return this.filteredData.slice(this.currentPageIndex * 10, this.currentPageIndex * 10 + 10)
    },
    // when search then return all filtered data
    filteredData: function () {
      var data = this.allData.reverse()
      if (this.search !== '') {
        data = _.filter(this.allData, (d) => {
        // console.log('dd', d)
          return d[this.tableFields.location].toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        // return d
        })
      }
      return data
    }
  },
  mounted () {
  },
  methods: {
    getAlltweets: function () {
      this.$emit('getAlltweets')
    },
    openData: function (a) {
      this.$emit('sendData', a, this.currentPageIndex)
      this.dataList = true
      this.id = a.id
    },
    formData: function (a, b) {
      if (a === 'hashTag') {
        if (b.length === 0) {
          return 0
        } else {
          var str = ''
          _.map(b, (tag) => {
            str += tag + ', '
          })
          return str
        }
      } else {
        return b
      }
    },
    setPage: function (index) {
      var length = Math.ceil(this.filteredData.length / this.perpage)
      if (index >= 0 && index < length) {
        this.currentPageIndex = index
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showAll {
  position: absolute;
  left: 500px;
  top: 200px;
  width: 200px;
  height: 30px;
  background: cornflowerblue;
  color: white;
}
tr {
  height: 41px;
}
.parentThHeading {
  color: rgb(74, 227, 135);
  border-bottom: 2px solid black;
  padding: 10px;
  height: 50px;
}
 .parentTable {
   overflow: scroll;
   width:100%;
   text-align: center;
   flex-shrink: 0;
   height: 500px;
 }
.backParent {
  position: relative;
  width: 66%;
  text-align: right;
  top: 20px;
}
 .searchgroup {
    width: 180px;
    border-bottom: 1px solid black;
    margin: 20px 20px 0px 20px;
  }
  .paginatation {
    flex-shrink: 0;
    text-align: center;
    height: 120px;
    position: relative;
    top: 50px;
  }
  input:focus {
      outline: none;
  }
  hr {
    display: block;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: auto;
    margin-right: auto;
    border-style: inset;
    border-width: 1px;
  }
  .buttonn {
    color: white;
    width: 50px;
    height: 30px;
    background-color: #4ae387;
    font-size: 16px;
    padding: 20px;
  }
  .buttonsnp {
    color: white;
    width: 55px;
    height: 30px;
    background-color: #4ae387;
    font-size: 16px;
    padding: 20px;
  }
  .wrapAllTable {
    min-width: 1350px !important;
    background-color: white;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  .current {
    background: #1EC260;
  }
  .popup {
    background: black;
    width: 100px;
    height: 100px
  }
  .th .td {
    border: 2px solid black;
    color: #0e0e0e;
  }
  .searchIcon {
    margin-right: 10px;
    margin-top: 7px;
    color: rgb(153, 162, 171);
    transform: rotate(90deg);
  }
  .capitalize {
     text-transform: capitalize;
  }
</style>
