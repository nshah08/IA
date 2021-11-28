import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchBar } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";
import { color, cos } from "react-native-reanimated";
import firebase from "firebase";
import updatefriends from "../../shardedComponents/Friends/Addfriends";
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';


export default class FriendsSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      country: null,
      type: null,
      language: null,
      campus: null,
      modalVisible: false,
      data: [],
      open: false,
      value: 'campus',
      Campus : [{label: 'On', value: 'on'}, {label: 'Off', value: 'off'}],
    };
    this.setValue = this.setValue.bind(this);
  }
  componentDidMount() {
    this.clearState();
  }
  componentWillUnmount() {}

  setOpen = (open) => {
    console.debug('opens dropdown')
    this.setState({
      open
    });
  }


  setValue(callback) {
    console.debug('set Value')
    this.setState(state => (
      console.debug('the value being inputed is ', callback(state.value)),
      { value: callback(state.value) }
    )
    );

  }

  /*setItems(callback) {
    this.setState(state => ({
      items: callback(state.items)
    }));
  }*/

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  clearState = () => {
    this.setState({
      name: null,
      country: null,
      type: null,
      language: null,
      campus: null,
      data: [],
     
    });

  };
  data = async (Uid) => {
    userRef = firebase.firestore().collection("users").doc(Uid);
    const doc = await userRef.get();
    var name = doc.data().name;
    var profpic = doc.data().profilepicture;
    console.log(Uid, name, profpic, friend);
    let friend = { uid: Uid, name: name, pic: profpic };
    this.setState({
      data: [...this.state.data, friend],
    });
  };

  Loc = async () => {
    var Friendquery = firebase.firestore().collection("users");
    const state = this.state;
    var criteria = {};
    for (const property in state) {
      //console.log(state[property])
      if (
        state[property] != null &&
        state[property] != true &&
        state[property] &&
        Array.isArray(state[property]) != true
      ) {
        console.log(property, state[property]);
        criteria[property] = state[property];
      }
    }
    //console.log(criteria);
    if (Object.keys(criteria).length > 0) {
      for (let i = 0; i < Object.keys(criteria).length; i++) {
        if (Object.keys(criteria)[i] == "language") {
          Friendquery = Friendquery.where(
            "language",
            "array-contains",
            Object.values(criteria)[i]
          );
        } else {
          Friendquery = Friendquery.where(
            Object.keys(criteria)[i],
            "==",
            Object.values(criteria)[i]
          );
        }
      }
      console.log(Friendquery)
    } else {
      console.log("invalid Search");
      alert("you suck");
    }

  
    if (Object.keys(criteria).length >= 1) {
      Friendquery = Friendquery.get().then((snap) => {
        console.log(snap.size);
        snap.forEach((doc) => {
          console.log(doc.id);
          this.data(doc.id);
        });
      });
    }
  };

  updatename = (name) => {
    this.setState({ name: name });
  };
  updatecountry = (count) => {
    if (count == "Any") {
      this.setState({ country: null });
    } else {
      this.setState({ country: count });
    }
    
  };
  updatetype = (type) => {
    if (type == "Any") {
      this.setState({ type: null });
    } else {
      this.setState({ type: type });
    }
  };
  updatelanguage = (language) => {
    if (language == "Any") {
      this.setState({ language: null });
    } else {
      this.setState({ language: language });
    }
  };
  updatecampus = (campus) => {
    if (campus == "Any") {
      this.setState({ campus: null });
    } else {
      this.setState({ campus: campus });
    }
    console.log(this.state.campus)
  };

  render() {
    const { modalVisible } = this.state;
    const { open, value } = this.state;
    const countries = [
      "Any",
      "Brazil",
      "Canada",
      "China",
      "Finland",
      "France",
      "India",
      "Japan",
      "Mexico",
      "Saudi Arabia",
      "South Korea",
      "Spain",
    ];
    const StudentType = ["Any", "International", "Native"];
    const Languages = [
      "Any",
      "Arabic",
      "Chinese",
      "English",
      "French",
      "Finish",
      "Hindi",
      "Japanese",
      "Korean",
      "Portuguese",
      "Spanish",
    ];
    const Campus = ["Any", "On", "Off"];
    const { name } = this.state;
    return (
      <View>
        <SearchBar
          placeholder="Search by Name..."
          onChangeText={this.updatename}
          showLoading={true}
          value={name}
        />
        <View>
          <Text> Region: </Text>
          <SelectDropdown
            dropdownStyle={{ color: "blue" }}
            data={countries}
            onSelect={(selectedItem) => {
              this.updatecountry(selectedItem);
            }}
          />
        </View>
        <View>
          <Text> Student Type: </Text>
          <SelectDropdown
            dropdownStyle={{ color: "blue" }}
            data={StudentType}
            onSelect={(selectedItem) => {
              this.updatetype(selectedItem);
            }}
          />
          
        </View>
        <View>
          <Text> Language: </Text>
          <SelectDropdown
            dropdownStyle={{ color: "blue" }}
            data={Languages}
            onSelect={(selectedItem) => {
              this.updatelanguage(selectedItem);
            }}
          />
        </View>
        <View>
          <Text> On Campus: </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={this.state.Campus}
            setOpen={this.setOpen}
            setValue={this.setValue}
            onChangeValue={(selectedItem) => {
              this.updatecampus(selectedItem);
            }}
          />
          {/*<SelectDropdown
            dropdownStyle={{ color: "blue" }}
            data={Campus}
            onSelect={(selectedItem) => {
              this.updatecampus(selectedItem);
            }}
          />*/}
        </View>
        <TouchableOpacity
          style={{ marginLeft: 150, marginTop: 25 }}
          onPress={() => {
            this.clearState();
          }}
        >
          <Text>Clear Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          //style={{ marginLeft: 150, marginTop: 25 }}
          onPress={() => {
            this.Loc().then(() => this.setModalVisible(true));
          }}
        >
          <Text>Search</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              this.setModalVisible(!modalVisible);
              this.clearState();
            }}
          >
            <Text>Back to Search</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.container}
            enableEmptySections={true}
            data={this.state.data}
            keyExtractor={(item) => {
              return item.name;
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity>
                  <View style={styles.box}>
                    <Image style={styles.image} source={{ uri: item.pic }} />
                    <Text style={styles.name}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        updatefriends(item.uid);
                      }}
                    >
                      <Text>Add</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    textAlignVertical: "center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 60,
    height: 60,
  },

  box: {
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
  },
  name: {
    color: "#20B2AA",
    fontSize: 22,
    alignSelf: "center",
    marginLeft: 10,
    textAlign: "center",
  },
});
