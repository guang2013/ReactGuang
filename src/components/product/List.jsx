/**
 * Created by guangwen on 2017/4/16.
 */
import React,{Component} from 'react';
import { Table,Button,message,Input,Popconfirm } from 'antd'
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';


class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }

    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        );
    }
}
class List extends Component {
    state={
        list:[],
        edit:false
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.getList()
    }
    renderColumns(data, index, key, text) {
        const { editable,status } = data[index];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <EditableCell
                editable={editable}
                value={text}
                onChange={value => this.handleChange(key, index, value)}
                status={status}
            />
        );
    }
    delete=(id)=>{
        axios.get('http://localhost:8000/product_delete/',{params:{id:id}}).then((res)=>{
            if(res && res.data && res.data ===200){
                message.success('Success to delete.')
                this.getList()
            }
            else {
                message.error('Fail to delete.')
            }
        })
        console.log(id)
    }
    getList=()=>{
        axios.get('http://localhost:8000/product_list/').then((res)=>{
            if(res && res.data){
                this.setState({
                    list:res.data
                })
            }

        })
    }
    edit(index) {
        const { list } = this.state;

        list[index]['editable']=true
        // Object.keys(list[index]).forEach((item) => {
        //
        //     if (list[index][item] && typeof list[index][item].editable === 'undefined') {
        //         list[index][item].editable = true;
        //     }
        // });
        this.setState({ list });
    }
    editDone(index, type) {

        const { list } = this.state;
        if(type === 'save'){
            if (list[index] && typeof list[index].editable !== 'undefined'){
                axios.post('http://localhost:8000/product_update/',list[index]).then((res)=>{
                    if(res && res.data && res.data ==200){
                        message.info('Success to save')
                    }

                })
            }

        }
        Object.keys(list[index]).forEach((item) => {
            if (list[index] && typeof list[index].editable !== 'undefined') {
                list[index].editable = false;
                list[index].status = type;
            }
        });
        this.setState({ list }, () => {
            Object.keys(list[index]).forEach((item) => {
                if (list[index] && typeof list[index].editable !== 'undefined') {
                    delete list[index].status;
                }
            });
        });
    }
    handleChange(key, index, value) {
        const { list } = this.state;
        list[index].value = value;
        this.setState({ list });
    }
    render() {
        const columns = [
            { title: 'ID', dataIndex: 'sid', key: 'sid',render: (text, record, index) => this.renderColumns(this.state.list, index, 'sid', text), },
            { title: 'Description', dataIndex: 'description', key: 'description' ,render: (text, record, index) => this.renderColumns(this.state.list, index, 'description', text),},
            { title: 'Datetime', dataIndex: 'datetime', key: 'datetime',render: (text, record, index) => this.renderColumns(this.state.list, index, 'datetime', text), },
            { title: 'Longitude', dataIndex: 'longitude', key: 'longitude',render: (text, record, index) => this.renderColumns(this.state.list, index, 'longitude', text),},
            { title: 'Latitude', dataIndex: 'latitude', key: 'latitude',render: (text, record, index) => this.renderColumns(this.state.list, index, 'latitude', text),},
            { title: 'Elevation', dataIndex: 'elevation', key: 'elevation', render: (text, record, index) => this.renderColumns(this.state.list, index, 'elevation', text),},
            {
                title: 'Action', dataIndex: 'id', key: 'id', width:'260px',render: (text, record, index) => {

                    const { editable } = this.state.list[index];
                    return (
                        <div>
                            <span><Button type={'primary'} onClick={(id) => {
                                 this.delete(text)
                            }}>Delete</Button>
                            </span>
                            {
                                editable ?
                                    <span>
                                  <Button onClick={() => this.editDone(index, 'save')}>Save</Button>
                                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                                    <Button>Cancel</Button>
                                  </Popconfirm>
                                </span>
                                    :
                                    <span>
                                    <Button type={'primary'} onClick={(id) => {
                                        this.edit(index)
                                    }}>Edit</Button>
                                    </span>

                            }


                        </div>
                    );
                },
            }

        ];
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="Product" second="List" />
                <Table
                    columns={columns}
                    // expandedRowRender={record => <p>{record.description}</p>}
                    dataSource={this.state.list}
                />
            </div>
        )
    }
}

export default List;


