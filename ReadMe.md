# react-native-modal-dialog
***
![alert.png](/Screenshots/alert.png)
![confirm.png](/Screenshots/confirm.png)
![prompt.png](/Screenshots/prompt.png)

***
For more usage, goto this online example: [expo](https://snack.expo.io/@zhengxiaoyao0716/github.com-zhengxiaoyao0716-react-native-modal-dialog:reactnativemodaldialog)

***

``` shell
# install
npm install react-native-modal-dialog --save
```

Simple use:
``` js
    // Inject method:
    render() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', }}>
            <Text style={styles.textButton} onPress={() => { this.refs.dialog.alert("message") }}>Alert</Text>
            <Text style={styles.textButton} onPress={() => { this.refs.dialog.confirm("message") }}>Confirm</Text>
            <Text style={styles.textButton} onPress={() => {
                this.refs.dialog.prompt("message", "placeholder", (text) => { this.setState({ text, }) }, );
            }}>Prompt:{this.state.text}</Text>
            {Dialog.inject()}
        </View>;
    };
    // Pre-build method:
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', }}>
        <Text style={styles.textButton} onPress={() => { this.refs.alert.show() }}>Alert</Text>
        <Text style={styles.textButton} onPress={() => { this.refs.confirm.show() }}>Confirm</Text>
        <Text style={styles.textButton} onPress={() => { this.refs.prompt.show(); }}>Prompt:{this.state.text}</Text>
        <Alert ref='alert' message='message'></Alert>
        <Confirm ref='confirm'><Text>children</Text></Confirm>
        <Prompt ref='prompt'>
            <TextInput placeholder='first' />
            <TextInput placeholder='second' />
        </Prompt>
    </View>;
    // {Xxx.inject()} == <Xxx ref='xxx'></Xxx>
    // this.refs.dialog.xxx(message, {...}) == this.refs.xxx.show({...})
```

Custom use:
[Example.js](/ReactNativeModalDialog/Example.js)
