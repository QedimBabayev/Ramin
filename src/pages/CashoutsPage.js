import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import cols from '../ColNames/Cashouts/colNames'
import {  Row } from 'antd';
import './Page.css'
import ResponsiveTable from '../components/ResponsiveTable';
import FilterPage from '../components/FilterPage';
import Filter from '../Filter/cashes'

class GridExampleContainer extends Component {
    contextRef = createRef()

    constructor(props) {
        super(props)
        this.state = {
            cols: cols
        }
    }



    render() {
        return (
            <Row className={'table_holder_section'}>
                <Row className='filter_table_wrapper_row doc'>
                    <FilterPage filter={Filter} />
                    <ResponsiveTable cols={cols} columns={cols.filter(c => c.hidden == false)} redirectTo={''} from={'cashouts'} editPage={''} foredit={'cashouts'} />
                </Row>

            </Row>

        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)