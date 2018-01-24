import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, Dimensions,
    Text, View, TouchableWithoutFeedback, TextInput, ScrollView,
    BackHandler
} from 'react-native';

const StylePropType = View.propTypes.style;

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = { hidden: true };
        this.onCancel = this.props.onCancel.bind(this);
        this.params = this.params || { ...this.props, onCancel: this.onCancel, };
    }
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        negText: PropTypes.string,
        onNegClick: PropTypes.func,
        posText: PropTypes.string,
        onPosClick: PropTypes.func,
        onCancel: PropTypes.func,
        dialogStyle: StylePropType,
        modalStyle: StylePropType,
        contentStyle: StylePropType,
        titleStyle: StylePropType,
        messageStyle: StylePropType,
        buttonBarStyle: StylePropType,
        buttonStyle: StylePropType,
    };
    static defaultProps = {
        posText: 'OK',
        onNegClick: function () { this.hide(); },
        onPosClick: function () { this.hide(); },
        onCancel: function () {
            this.hide();
            return true;
        },
    };
    render() {
        if (this.state.hidden) {
            return null;
        }
        const {
            title,
            message,
            children,
            onCancel,
            negText,
            onNegClick,
            posText,
            onPosClick,
            dialogStyle,
            modalStyle,
            contentStyle,
            titleStyle,
            messageStyle,
            buttonBarStyle,
            buttonStyle,
        } = this.params;
        return <View style={[styles.dialog, dialogStyle]}>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={[styles.dialogModal, modalStyle]}></View>
            </TouchableWithoutFeedback>
            <View style={[styles.dialogContent, contentStyle]}>
                {title ? <Text style={[styles.dialogTitle, titleStyle]}>{title}</Text> : null}
                <ScrollView>{
                    message ? <Text style={[styles.dialogMessage, messageStyle]}>{message}</Text>
                        : children ? Children.map(children, (children) => children) : null
                }</ScrollView>
                <View style={[styles.dialogButtonBar, buttonBarStyle]}>
                    {negText ? <Text
                        style={[styles.dialogButton, buttonStyle]}
                        onPress={onNegClick.bind(this)}>
                        {negText}
                    </Text> : null}
                    <Text style={[styles.dialogButton, buttonStyle]} onPress={onPosClick.bind(this)}>{posText}</Text>
                </View>
            </View>
        </View>
    }
    _lockQueue = [];
    show(params) {
        // this.state.hidden || this.hide();
        if (!this.state.hidden && this.lock) {
            // console.warn('This dialog has already shown.');
            // return;
            this._lockQueue.push(params);
            return;
        }
        this.lock = true;
        this.params = { ...this.props, onCancel: this.onCancel, ...params, };
        this.setState({ hidden: false, });
        BackHandler.addEventListener('cancelDialog', this.params.onCancel);
    }
    hide() {
        BackHandler.removeEventListener('cancelDialog', this.params.onCancel);
        this.setState({ hidden: true });
        this.lock = false;
        this._lockQueue[0] && this.show(this._lockQueue[0]);
        this._lockQueue = this._lockQueue.slice(1);
    }
    alert(message, params) {
        this.show({
            title: 'Alert',
            message: message,
            ...params,
        });
    }
    confirm(message, params) {
        this.show({
            title: 'Confirm',
            message: message,
            negText: 'cancel',
            ...params,
        })
    }
    prompt(message, placeholder, onChangeText, params) {
        this.show({
            title: 'Prompt',
            negText: 'Cancel',
            children: [
                <Text style={[styles.dialogMessage, params && params.messageStyle || this.props.messageStyle]}>{message}</Text>,
                <TextInput
                    style={{ height: 40 }}
                    placeholder={placeholder}
                    onChangeText={onChangeText && onChangeText.bind(this)}
                />
            ],
            ...params,
        })
    }
    static inject(ref) {
        return <Dialog ref={ref || 'dialog'}></Dialog>;
    }
};
export class Alert extends Dialog {
    static defaultProps = {
        ...Dialog.defaultProps,
        title: 'Alert',
    };
    static inject(ref) {
        return <Alert ref={ref || 'alert'}></Alert>
    }
};
export class Confirm extends Dialog {
    static defaultProps = {
        ...Dialog.defaultProps,
        title: 'Confirm',
        negText: 'Cancel',
    };
    static inject(ref) {
        return <Confirm ref={ref || 'confirm'}></Confirm>
    }
};
export class Prompt extends Dialog {
    static propTypes = {
        placeholder: PropTypes.string,
        onChangeText: PropTypes.func,
    };
    static defaultProps = {
        ...Dialog.defaultProps,
        title: 'Prompt',
        message: undefined,
        children: [, ,],
        negText: 'Cancel',
    };
    render() {
        const { children, placeholder, onChangeText, messageStyle, } = this.params;
        if (children.length == 2 && children[0] === undefined && children[1] === undefined) {
            const _shouldComponentUpdate = this.shouldComponentUpdate;
            this.shouldComponentUpdate = () => false;
            children[1] = <Text style={[styles.dialogMessage, messageStyle]}>undefined</Text> ,
                children[1] = <TextInput
                    style={{ height: 40 }}
                    placeholder={placeholder || ''}
                    onChangeText={onChangeText && onChangeText.bind(this)}
                />;
            this.shouldComponentUpdate = _shouldComponentUpdate;
        }
        return super.render();
    }
    static inject(ref) {
        return <Prompt ref={ref || 'prompt'}></Prompt>
    }
};

const [width, height] = [Dimensions.get('window').width, Dimensions.get('window').height];
const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogModal: {
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.3,
        width: width,
        height: height,
    },
    dialogContent: {
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: 3,
        paddingTop: 10,
        paddingLeft: 16,
        paddingBottom: 10,
        paddingRight: 16,
        width: width - 48,
        maxHeight: height / 3 * 2,
    },
    dialogTitle: {
        color: '#000',
        fontSize: 21,
        padding: 9,
    },
    dialogMessage: {
        color: '#000',
        fontSize: 16,
        padding: 9,
    },
    dialogButtonBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    dialogButton: {
        textAlign: 'right',
        color: '#197',
        fontSize: 15,
        padding: 12,
        marginLeft: 24,
        marginRight: 8,
    },
});
