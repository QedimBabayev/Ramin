import React, { Component } from 'react'
import { connect } from 'react-redux'
import Trans from '../usetranslation/Trans';
import { deleteResponseService } from '../actions/putAactions/deleteResponseService';
import { putLocalStates } from '../actions/modalActions/putModalInputs-action';
import { getCustomers, getCustomersFast } from '../actions/getCustomerGroups-action';
import getMarks from '../actions/getMarks-action'
import { getGroups } from '../actions/getGroups-action';
import { getCustomerGroupsModal, getStocksGroupsModal, productModalFilter, getProductsModal, getProductsGroupModal } from '../actions/modalActions/getCustomerGroupsModal-action';
import CreateCustomerModal from '../modal/CreateCustomerModal';
import { getCustomersData, updateCustomerSelect } from '../actions/getCustomerGroups-action';
import CreateStockModal from '../modal/CreateStockModal';
import filterObject from '../config/filterObject';
import { poistionArray, description, consumption } from './DocTable';
import LoaderHOC from './LoaderHOC';
import { API_BASE } from '../config/env';
import axios from 'axios';
import Sound from 'react-sound';
import ok from '../audio/ok.mp3'
import { getToken } from '../config/token';
import putData from '../actions/putAactions/putData-action';
import { changeForm } from '../actions/updateStates-action';
import { saveDocument, progress, isCreated } from '../actions/putAactions/saveDocument';
import { createNewDocId } from '../actions/putAactions/saveDocument';
import { PickerProps } from "antd/lib/date-picker/generatePicker"
import moment, { Moment } from 'moment';
import { putMark, delMark } from '../actions/getMarks-action';
import {
    Form, Input, Drawer, Button, Popconfirm, InputNumber, message, TreeSelect, Checkbox, Dropdown, DatePicker, Switch, Select, Spin, Tag, Divider, Menu, Col, Row, Collapse
} from 'antd';

import {
    PrinterOutlined,
    UserAddOutlined,
    PlusOutlined,
    LoadingOutlined,
    DeleteOutlined,
    EditOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Null_Content } from '../config/env';
import AddStockModal from '../modal/AddStockModal';
import './ButtonsWrapper.css'
import './DocForm.css'
const { Option, OptGroup } = Select;
const { Panel } = Collapse;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
var newArrStocks = []
var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrStocks = []
var newArrCustomers = []
var lowerCaseMarks = []
var lowerCaseCustomers = []
var ownersOptions = []
var depOptions = []
var pid;
function convert(array) {
    var map = {}
    for (var i = 0; i < array.length; i++) {
        var obj = array[i]
        if (!(obj.id in map)) {
            map[obj.id] = obj
            map[obj.id].children = []
        }

        if (typeof map[obj.id].name == 'undefined') {
            map[obj.id].id = obj.id
            map[obj.id].name = obj.name
            map[obj.id].parent = obj.parent
            map[obj.id].value = obj.value
            map[obj.id].label = obj.label
        }

        var parent = obj.parent || '-';
        if (!(parent in map)) {
            map[parent] = {}
            map[parent].children = []
        }

        map[parent].children.push(map[obj.id])
    }
    return map['-']
}

var sendObject = {}


class EnterFormComponent extends Component {
    formRef = React.createRef();

    state = {
        visibleCustomer: false,
        visibleStock: false,
        visibleCatalog: false,
        customerEdit: false,
        stockEdit: false,
        customerCreate: false,
        stockCreate: false,
        createdCustomerId: '',
        createdStockId: '',
        newDocId: '',
        createdCustomerName: '',
        editMarkColor: '',
        selectedMarkId: '',
        editMarkName: '',
        editMarkId: '',
        createdMarkId: '',
        createdMarkName: '',
        createdMarkColor: '',
        markEdit: false,
        markCreate: false,
        markLoading: false,
        markEditVisible: false,

    }
    componentDidMount = () => {
        this.props.createNewDocId('')
        var id = this.props.saledoc ? this.props.saledoc.doc.CustomerId : this.props.doc ? this.props.doc.CustomerId : ''
        this.props.getCustomersData(id)
        if (!this.props.doc) {
            this.formRef.current.setFieldsValue({
                moment: moment(),
            })
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.state.putdatas.responseCustomerId.ResponseService) {
            if (nextProps.state.putdatas.responseCustomerId.ResponseService != this.props.state.putdatas.responseCustomerId.ResponseService) {
                this.setState({
                    customerCreate: true,
                    createdCustomerId: nextProps.state.putdatas.responseCustomerId.ResponseService
                }, () => {
                    this.formRef.current.setFieldsValue({
                        customerid: nextProps.state.docmodals.localStates.name,

                    })
                })

            }
            else {
                this.setState({
                    customerCreate: false
                })
            }
        }

        if (nextProps.state.putdatas.responseStockId.ResponseService) {
            if (nextProps.state.putdatas.responseStockId.ResponseService != this.props.state.putdatas.responseStockId.ResponseService) {
                this.setState({
                    stockCreate: true,
                    createdStockId: nextProps.state.putdatas.responseStockId.ResponseService
                }, () => {
                    this.formRef.current.setFieldsValue({
                        stockid: nextProps.state.docmodals.localStates.name,
                    })
                })

            }
            else {
                this.setState({
                    stockCreate: false
                })
            }
        }
        if (nextProps.state.marks.newMarkId != '') {
            if (nextProps.state.marks.newMarkId != this.props.state.marks.newMarkId) {
                this.setState({
                    markCreate: true,
                    createdMarkId: nextProps.state.marks.newMarkId,
                }, () => {
                    this.formRef.current.setFieldsValue({
                        mark: this.state.createdMarkName
                    })
                })
            }
            else {
                this.setState({
                    markCreate: false
                })
            }
        }

        if (nextProps.state.savedoc.docName) {
            if (nextProps.state.savedoc.docName != this.props.state.savedoc.docName) {
                this.formRef.current.setFieldsValue({
                    name: nextProps.state.savedoc.docName
                })
            }
        }


        if (nextProps.state.savedoc.newDocId != '') {
            if (nextProps.state.savedoc.newDocId != this.props.state.savedoc.newDocId) {
                this.formRef.current.setFieldsValue({
                    id: nextProps.state.savedoc.newDocId
                })
            }
        }

    }

    showDrawer = () => {
        this.setState({
            visibleCustomer: true,
        });
        this.props.getCustomerGroupsModal()
        this.props.deleteResponseService()
        this.props.putLocalStates('')
    };
    showStockDrawer = () => {
        this.setState({
            visibleStock: true,
        });
        this.props.deleteResponseService()
        this.props.getStocksGroupsModal()
        this.props.putLocalStates('')
    };

    onClose = () => {
        this.setState({
            visibleCustomer: false,
        });
    };


    onCloseStock = () => {
        this.setState({
            visibleStock: false,
        });
    };

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
        this.props.getCustomerGroupsModal()
    };



    doSearch = (value) => {
        this.props.getCustomersFast(value)
    }
    getMarks = () => {
        lowerCaseMarks = []
        this.props.getMarks()
    }
    getCustomers = () => {
        this.setState({
            customerEdit: true
        })
        newArrCustomers = []
        this.props.getCustomers()
    }
    getStocks = () => {
        this.setState({
            stockEdit: true
        })
        newArrStocks = []
        customCascaderStock = [];
        this.props.getGroups('stocks')
    }

    handleMarkId = (value, option) => {
        console.log('option', option)
        delete sendObject['mark'];
        sendObject.mark = option ? option.key : null
        this.setState({
            selectedMarkId: option ? option.key : null
        })
    }

    handleCreatedDoc = () => {
        this.props.isCreated(false)
    }

    onChange = (value, option) => {
        this.props.getCustomersData(value)
    }
    onChangeField = () => {
        this.props.changeForm(true)
    }


    onNameChange = (e) => {
        this.setState({
            createdMarkName: e.target.value,
        });
    }

    handleColorChange = (e) => {
        this.setState({
            createdMarkColor: e.target.value,
        });
    }

    handleEditColorChange = (e) => {
        this.setState({
            editMarkColor: e.target.value,
        });
    }

    onChangeEditMark = (e) => {
        this.setState({
            editMarkName: e.target.value,
        });
    }
    handleDeleteMark = (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        this.props.delMark(id)
    }
    handleEditMark = (e, id, name, color) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            editMarkId: id,
            editMarkName: name,
            editMarkColor: color,
            markEditVisible: true,
        })
    }
    handleCloseEditMark = (e, id, name) => {
        this.props.getMarks()
        this.setState({
            editMarkId: '',
            editMarkName: '',
            editMarkColor: '',
            markEditVisible: false
        })
    }

    timePickerBlur = (time) => {
        //Ofc you can use state or whatever here :)
        this.formRef.current.setFieldsValue({
            moment: moment(time),
        });
    }

    editMark = () => {
        this.setState({
            markLoading: true
        })
        var markFilter = {}
        markFilter.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
        markFilter.id = this.state.editMarkId
        markFilter.name = this.state.editMarkName
        markFilter.color = this.state.editMarkColor
        this.editMarks(markFilter).then(d => this.setState({
            markLoading: false

        }))
    }

    async editMarks(object) {
        const res = await axios.post(`${API_BASE}/marks/edit.php`, object);
        return await res;
    }
    addItem = () => {

        var markFilter = {}
        markFilter.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
        markFilter.name = this.state.createdMarkName
        markFilter.color = this.state.createdMarkColor
        this.props.putMark(markFilter)

    }
    onFinish = (values) => {
        sendObject = values;
        sendObject.positions = poistionArray
        if (!values.moment) {
            this.formRef.current.setFieldsValue({
                moment: moment(),
            }, () => {
                sendObject.moment = values.moment._d
                sendObject.modify = values.moment._d
            })
        }
        else {
            sendObject.moment = values.moment._d
            sendObject.modify = values.modify._i
        }

        sendObject.description = description
        sendObject.consumption = consumption ? consumption : undefined
        sendObject.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
        if (this.state.createdCustomerId != '') {
            delete sendObject['customerid'];
            sendObject.customerid = this.state.createdCustomerId
        }

        if (this.state.selectedMarkId === '') {
            delete sendObject['mark'];
            sendObject.mark = this.props.doc.Mark
        }
        else if (this.state.selectedMarkId === null) {
            delete sendObject['mark'];
        }
        else {
            delete sendObject['mark'];
            sendObject.mark = this.state.selectedMarkId
        }
        if (this.state.createdMarkId != '') {
            delete sendObject['mark'];
            sendObject.mark = this.state.createdMarkId
        }
        if (this.state.createdStockId != '') {
            delete sendObject['stockid'];
            sendObject.stockid = this.state.createdStockId
        }
        this.props.state.savedoc.newDocId != '' ? sendObject.id = this.props.state.savedoc.newDocId : sendObject.id = values.id
        progress(true)

        this.props.saveDocument('enters', sendObject)
    };
    render() {

        //#region important arrays start
        lowerCaseMarks = []
        newArrStocks = []
        customCascaderStock = []
        depOptions = []
        ownersOptions = []

        //#endregion

        //#region marks loading start here
        const markOptions = (
            Object.values(this.props.state.marks.marks).map(mark =>
                <Option className='mark_option_wrapper' value={mark.Name} key={mark.Id}><span>{mark.Name}</span><span className='mark_option_icons_wrapper'>
                    <EditOutlined style={{ marginRight: '8px', color: '#0288d1' }} id={mark.Id} onClick={(e) => this.handleEditMark(e, mark.Id, mark.Name, mark.Color)} />
                    <DeleteOutlined style={{ color: 'red' }} onClick={(e) => this.handleDeleteMark(e, mark.Id)} />
                </span></Option>
            )
        )

        //#endregion marks loading ends here


        Object.values(this.props.state.groups.groups).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascaderStock.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })
        newArrStocks = convert(customCascaderStock)




        Object.values(this.props.state.owdep.owners).map(r => {
            ownersOptions.push({
                label: r.Name,
                value: r.Id,
            })
        })
        Object.values(this.props.state.owdep.departments).map(r => {
            depOptions.push({
                label: r.Name,
                value: r.Id,
            })
        })
        return (

            <>
                <Sound
                    url={ok}
                    playStatus={this.props.state.savedoc.iscreated ? Sound.status.PLAYING : Sound.status.Stopped}
                    onFinishedPlaying={this.handleCreatedDoc}
                />
                <Form id='myForm' className='doc_forms' ref={this.formRef}
                    name="basic"
                    initialValues={
                        {
                            name: this.props.doc ? this.props.doc.Name : '',
                            stockid: this.props.doc ? this.props.doc.StockId : '',
                            customerid: this.props.doc ? this.props.doc.CustomerId : '',
                            ownerid: this.props.doc ? this.props.doc.OwnerId : '',
                            departmentid: this.props.doc ? this.props.doc.DepartmentId : '',
                            status: this.props.doc ? this.props.doc.Status === 1 ? true : false : true,
                            modify: this.props.doc ? moment(this.props.doc.Modify) : '',
                            moment: this.props.doc ? moment(this.props.doc.Moment) : '',
                            id: this.props.doc ? this.props.doc.Id : this.state.editid ? this.state.editid : '',
                            mark: this.props.doc ? this.props.state.marks.marks.find(m => m.Id === this.props.doc.Mark) ? this.props.state.marks.marks.find(m => m.Id === this.props.doc.Mark).Name : '' : '',


                        }
                    }
                    layout="horizontal"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    onFieldsChange={this.onChangeField}
                >







                    <div className='form_total_top_wrapper'>
                        <Row className='top_wrapper_holder'>
                            <Col xs={24} md={24} xl={7}>
                                <div className='first_form_wrapper'>
                                    <Form.Item
                                        label={<Trans word={'Enter Number'} />}
                                        name="name"
                                        className='doc_number_form_item'
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                    <Form.Item
                                        label={<Trans word={'Created Moment'} />}
                                        name="moment"
                                    >
                                        <DatePicker onSelect={this.timePickerBlur} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                                    </Form.Item>

                                    <Form.Item
                                        label="D??yi??m?? tarixi"
                                        name="modify"
                                        className='modified_date_input'
                                        style={{ display: this.props.docid != '' ? 'flex' : 'none' }}

                                    >
                                        <DatePicker disabled={true} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                                    </Form.Item>


                                </div>
                            </Col>
                            <Col xs={24} md={24} xl={6}>

                                <div className='second_form_wrapper'>
                                    <Form.Item
                                        label='Status'
                                        name='mark'

                                    >
                                        <Select
                                            showSearch
                                            showArrow={false}
                                            filterOption={false}
                                            className='customSelect'
                                            allowClear={true}
                                            onChange={this.handleMarkId}
                                            onFocus={this.getMarks}
                                            placeholder="Status"
                                            notFoundContent={<Spin size="small" />}
                                            loading={this.props.state.marks.markLoading ? <Spin size="small" /> : ''}
                                            dropdownRender={menu => (
                                                <div className='site-drawer-render-in-current-wrapper customDrawer'>
                                                    {menu}
                                                    <Divider style={{ margin: '4px 0' }} />
                                                    <Drawer
                                                        title="Status ad??"
                                                        placement="right"
                                                        closable={false}
                                                        onClose={this.handleCloseEditMark}
                                                        visible={this.state.markEditVisible}
                                                        getContainer={false}
                                                        style={{ position: 'absolute' }}
                                                    >
                                                        <Input style={{ width: '115px' }} onChange={this.onChangeEditMark} value={this.state.editMarkName} />
                                                        <Input type='color' value={this.state.editMarkColor} onChange={this.handleEditColorChange} />
                                                        <Button loading={this.state.markLoading} onClick={this.editMark}>Yadda saxla</Button>
                                                    </Drawer>
                                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8, flexDirection: 'column' }}>
                                                        <Input style={{ flex: 'auto' }} placeholder='Status ad??' onChange={this.onNameChange} />
                                                        <Input type='color' defaultValue='#0288d1' onChange={this.handleColorChange} />
                                                        <a
                                                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                            onClick={this.addItem}
                                                        >
                                                            <PlusOutlined /> ??lav?? et
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                        >
                                            {this.props.state.marks.markLoading ? [] : markOptions}
                                        </Select>



                                    </Form.Item>


                                    <div className='plus_wrapper'>
                                        <Form.Item

                                            label={<Trans word={'Stock Groups'} />}
                                            name='stockid'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Z??hm??t olmasa, anbar qrupunu se??in',
                                                },
                                            ]}
                                        >
                                            <TreeSelect
                                                className='doc_status_formitem_wrapper_col customSelect'
                                                allowClear
                                                onFocus={this.getStocks}
                                                notFoundContent={<Spin size="small" />}
                                                treeData={newArrStocks ? newArrStocks.children : []}
                                            />

                                        </Form.Item>
                                        <PlusOutlined onClick={this.showStockDrawer} className='add_elements' />

                                    </div>


                                </div>
                            </Col>
                            <Col xs={24} md={24} xl={3}>
                                <div className='second_form_wrapper'>
                                    <Form.Item label="Ke??irilib" className='docComponentStatus' name='status' valuePropName="checked">
                                        <Checkbox name='status' onChange={this.handleBarcodeSelect}  ></Checkbox>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} md={24} xl={6}>
                                <div className='second_form_wrapper'>
                                    <div className='form_top_side doc_permission'>
                                        <Collapse ghost>
                                            <Panel className='custom_panel_header' header="T??yinat" key="1">
                                                <Form.Item
                                                    label={'Cavabdeh'}
                                                    name="ownerid"
                                                    style={{ margin: '0' }}
                                                >

                                                    <Select
                                                        showSearch
                                                        placeholder=""
                                                        filterOption={false}
                                                        notFoundContent={<Spin size="small" />}
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={ownersOptions}
                                                    />

                                                </Form.Item>
                                                <Form.Item
                                                    label={'????b??'}
                                                    name="departmentid"
                                                    style={{ margin: '0' }}
                                                >

                                                    <Select
                                                        showSearch
                                                        placeholder=""
                                                        notFoundContent={<Spin size="small" />}
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={depOptions}
                                                    />
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    </div>

                                    <div className='form_top_side doc_permission'>
                                        <Form.Item
                                            label="D??yi??m?? tarixi"
                                            name="modify"
                                            className='modified_date_input'
                                            style={{ display: this.props.docid != '' ? 'flex' : 'none' }}

                                        >
                                            <DatePicker disabled={true} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                                        </Form.Item>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Form.Item hidden={true}
                        label="id"
                        name="id"
                    >
                        <Input />
                    </Form.Item>
                </Form>
                <CreateCustomerModal from='createDemand' visible={this.state.visibleCustomer} childrenDrawer={this.state.childrenDrawer} onClose={this.onClose} showChildrenDrawer={this.showChildrenDrawer} onChildrenDrawerClose={this.onChildrenDrawerClose} />
                <CreateStockModal visible={this.state.visibleStock} onClose={this.onCloseStock} />

            </>



        )
    }
}

const mapStateToProps = (state) => ({
    state

})

const mapDispatchToProps = {
    putData, getMarks, putMark, delMark, saveDocument, isCreated, createNewDocId, getCustomersData, updateCustomerSelect, deleteResponseService, getProductsModal, getProductsGroupModal, getGroups, getStocksGroupsModal, getCustomers, getCustomersFast, putLocalStates, getCustomerGroupsModal, changeForm
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(EnterFormComponent, 'datas'))
