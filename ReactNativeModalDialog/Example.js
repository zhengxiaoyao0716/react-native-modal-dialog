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
            <Text style={styles.textButton} onPress={() => { this.refs.dialog.alert("message") }}>Alert</Text>
            <Text style={styles.textButton} onPress={() => { this.refs.dialog.confirm("message") }}>Confirm</Text>
            <Text style={styles.textButton} onPress={() => {
                this.refs.dialog.prompt("message", "placeholder", (text) => { this.setState({ text, }) }, );
            }}>Prompt:{this.state.text}</Text>
            <Text style={styles.textButton} onPress={() => {
                this.refs.dialog.alert(undefined, {
                    title: "customTitle",
                    titleStyle: { color: '#03A9F4', },
                    children: <View><Text>customChildren</Text></View>,
                    posText: 'customButton',
                    buttonStyle: { color: '#03A9F4', },
                    onPosClick: () => {
                        this.refs.dialog.hide();
                        this.refs.dialog.alert("customMessage", {
                            messageStyle: { fontSize: 12, },
                            title: undefined,
                        });
                    },
                })
            }}>Custom Alert</Text>
            <Text style={styles.textButton} onPress={() => {
                this.refs.dialog.confirm("must choose one, can't cancel", {
                    onCancel: () => true,
                    negText: 'multi-show',
                    onNegClick: () => {
                        this.refs.dialog.hide();
                        this.refs.dialog.alert('First dialog.', { posText: 'Closed this to show second dialog.' });
                        this.refs.dialog.alert('This is the second dialog.');
                    },
                    posText: 'scroll',
                    onPosClick: () => {
                        this.refs.dialog.hide();
                        this.refs.dialog.alert((function counter(count) { return count ? counter(count - 1) + count + '\n' : '0\n'; })(30));
                    },
                    contentStyle: { backgroundColor: "#6cf"},
                })
            }}>Custom Confirm</Text>

            {/*Pre-build methods*/}
            <Text style={styles.textButton} onPress={() => { this.refs.alert.show() }}>Pre-build Alert</Text>
            <Text style={styles.textButton} onPress={() => { this.refs.confirm.show() }}>Pre-build Confirm</Text>
            <Text style={styles.textButton} onPress={() => { this.refs.prompt.show(); }}>Pre-build Prompt:{this.state.text}</Text>

            {Dialog.inject()}
            <Alert ref='alert' message='message'></Alert>
            <Confirm ref='confirm' contentStyle={{ backgroundColor: "#6cf"}}><Text>children</Text></Confirm>
            <Prompt ref='prompt'>
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