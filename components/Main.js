import * as React from "react";
import { Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    tags: null
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
    );
  }

  componentDidMount() {
    console.log("the component mounted");
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri }, () => {
        this.runDeepTag();
      });
    }
  };

  runDeepTag = () => {
    console.log("deeptag now running");
    console.log(this.state.image);
    console.log(JSON.stringify(this.state.image));
    return fetch(
      "https://europe-west1-piwi-project.cloudfunctions.net/ML-Hashtagger",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          image: this.state.image
        })
      }
    )
      .then(response => {
        console.log("response received======");
        console.log(response);
      })
      .catch(error => {
        console.log("error===========");
        console.error(error);
      });
  };
}
