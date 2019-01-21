import React, { Component } from 'react';
import Loadable from 'react-loadable';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => <div className='container' style={{
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
}}>
    <CircularProgress />
</div>;

const PageLoadable = (dynamic_import) => Loadable({ loader: dynamic_import, loading: Loader });

const AppLoadable = (App) => Loadable({
    loader: () => fetch('./all-forms.json').then(res => res.json()).then(json => {
        return () => <SocketAppFormReloader App={App} formData={json} />;
    }),
    loading: Loader,
});

class SocketAppFormReloader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            io: null,
            formData: props.formData,
            usbData: null
        };
    }
    componentDidMount() {
        import('socket.io-client/dist/socket.io.slim.js').then(({default: io}) => {
            this.setState({io: io()});
            this.state.io.on('update:formData', (formData) => this.setState({ formData }));
            this.state.io.on('update:usbData', (usbData) => this.setState({ usbData }));
        });
    }
    componentWillUnmount() {
        if(this.state.io) {
            this.state.io.disconnect();
        }
    }

    render() { 
        const { formData, usbData } = this.state;
        return React.createElement(this.props.App, { usbData, formData });
    }
}
 
export default SocketAppFormReloader;

export {
    Loader,
    PageLoadable,
    AppLoadable,
};