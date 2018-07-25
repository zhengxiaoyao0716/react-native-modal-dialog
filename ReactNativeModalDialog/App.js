import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text, TextInput,
} from 'react-native';

import Dialog, { Alert, Confirm, Prompt, } from 'react-native-modal-dialog';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', };
  }
  render() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', }}>
      {/*Inject methods*/}
      <Text style={styles.textButton} onPress={() => { this.dialog.alert("message") }}>Alert</Text>
      <Text style={styles.textButton} onPress={() => { this.dialog.confirm("message") }}>Confirm</Text>
      <Text style={styles.textButton} onPress={() => {
        this.dialog.prompt("message", "placeholder", (text) => { this.setState({ text, }) }, );
      }}>Prompt:{this.state.text}</Text>
      <Text style={styles.textButton} onPress={() => {
        this.dialog.alert(undefined, {
          title: "customTitle",
          titleStyle: { color: '#03A9F4', },
          children: <View><Text>customChildren</Text></View>,
          posText: 'customButton',
          buttonStyle: { color: '#03A9F4', },
          onPosClick: () => {
            this.dialog.hide();
            this.dialog.alert("customMessage", {
              messageStyle: { fontSize: 12, },
              title: undefined,
            });
          },
        })
      }}>Custom Alert</Text>
      <Text style={styles.textButton} onPress={() => {
        this.dialog.confirm("must choose one, can't cancel", {
          onCancel: () => true,
          negText: 'multi-show',
          onNegClick: () => {
            this.dialog.hide();
            this.dialog.alert('First dialog.', { posText: 'Closed this to show second dialog.' });
            this.dialog.alert('This is the second dialog.');
          },
          posText: 'scroll',
          onPosClick: () => {
            this.dialog.hide();
            this.dialog.alert((function counter(count) { return count ? counter(count - 1) + count + '\n' : '0\n'; })(30));
          },
          contentStyle: { backgroundColor: "#6cf" },
        })
      }}>Custom Confirm</Text>

      {/*Pre-build methods*/}
      <Text style={styles.textButton} onPress={() => { this.alert.show() }}>Pre-build Alert</Text>
      <Text style={styles.textButton} onPress={() => { this.confirm.show() }}>Pre-build Confirm</Text>
      <Text style={styles.textButton} onPress={() => { this.prompt.show(); }}>Pre-build Prompt:{this.state.text}</Text>

      {Dialog.inject(dialog => this.dialog = dialog)}
      <Alert ref={alert => this.alert = alert} message='message'></Alert>
      <Confirm ref={confirm => this.confirm = confirm} contentStyle={{ backgroundColor: "#6cf" }}><Text>children</Text></Confirm>
      <Prompt ref={prompt => this.prompt = prompt}>
        <TextInput placeholder='first' />
        <TextInput placeholder='second' />
      </Prompt>
    </View>;
  }
}

const styles = StyleSheet.create({
  textButton: {
    fontSize: 24,
    color: '#fff',
    backgroundColor: '#03A9F4',
    borderRadius: 8,
    padding: 8,
    margin: 8,
  }
});