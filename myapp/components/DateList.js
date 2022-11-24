import React, {useEffect, useState} from 'react'
import { FlatList, RefreshControl, TextInput, StyleSheet, TouchableOpacity, Text, View} from 'react-native'
import {useIsFocused} from '@react-navigation/native'

import DateItem from './DateItem'
import { getDates , deleteDate, getDateByDate } from '../api'
import Layout from './Layout'

//mport { View } from 'react-native-web'


const DateList = () => {
    
    const [dates, setDates] = useState([]);
    const [datesByDate, setDatesByDate] = useState([]);
    const [dateToFind,setDateToFind] = useState("");
    const [isAllDates, setIsAllDates] = useState(false);
    const [refreshing, setrefreshing ] = useState([false]);
    const [todayDates, setTodayDates] = useState([]);
    const [isTodayDates, setIsTodayDates] = useState(true)

    const isFocused = useIsFocused();

    const loadDates = async () => {
        const data = await getDates();
        getTodayDates(data);
        setDates(data);
        
    }
    /*
    //continuar con busqueda por fecha
    const loadDatesByDate = async () =>{
        const data = await getDateByDate("2022-11-11");
        //setDatesByDate(data);
    }*/

    function formatDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    


    const getTodayDates = (date) =>{
        for(let i = 0; i <= todayDates.length; i++){todayDates.pop()}
        const today = formatDate();
        console.log(today)
        date.map((item) =>{
            if (item.fecha == today) {
                todayDates.push(item)
            }
        })
        console.log(todayDates);
        console.log(date); 

    }


    const getSelectedDate = () => {
        for(let i = 0; i <= datesByDate.length; i++){datesByDate.pop();}
        setIsAllDates(false);
        
        console.log("all" + isAllDates)
        dates.map((item) => {
            if (item.fecha == dateToFind) {
                datesByDate.push(item);
            }
        })
    }

    const handleDatesShow = () => {
    }
    useEffect(() => {
        loadDates();
        //formatDate()
        //getTodayDates();
        //oadDatesByDate();
    }, [isFocused, isAllDates, isTodayDates]);


    const handleDelete = async (id) => {
        await deleteDate(id);
        await loadDates();
    }

    const renderItem = ({ item }) => {
        return <DateItem date={item} handleDelete={handleDelete}/>
    }

    const renderItemByDate = ({ item }) => {
        return <DateItem date={item} handleDelete={handleDelete}/>
    }


    const refresh = React.useCallback(async () =>{
        setrefreshing([true]);
        await loadDates();
        setrefreshing([false]);
        
    })

    const selectDates = (tip) => {
        if(!isAllDates && isTodayDates){
            return todayDates
        }else{
            return dates
        }
    }
    return (
    <View style={{width: '100%',height: '100%'}}>
        <TextInput
            style={styles.input}
            placeholder = 'Fecha de datos'
            placeholderTextColor = 'grey'
            onChangeText={(text) => {setDateToFind(text)}}
        />
        <View style={styles.showAllButtons}>
        <TouchableOpacity style={styles.findButton} onPress={() => {getSelectedDate()}}>
            <Text style={ styles.textButton }>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.findButton} onPress={() => {setIsAllDates(true),setIsTodayDates(false)}}>
            <Text style={ styles.textButton }>Todas</Text>
        </TouchableOpacity>
        </View>
        {
            !isAllDates && !isTodayDates ?(
                <FlatList
                styles={{width: '100%',height: '100%'}}
                    data={datesByDate}
                    keyExtractor={(item) => item.id_cita + ''}
                    renderItem={renderItemByDate}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refresh}
                        />
                    }
                />
            ) : isAllDates && !isTodayDates ? (
                <FlatList 
            style={{width: '100%'}}
                data={dates}
                keyExtractor={(item) => item.id_cita + ''}
                renderItem={renderItem}
                refreshControl={
                <RefreshControl
                    onRefresh={refresh}
                />
            }
        />
            ) : (
                <FlatList
                styles={{with: '100%'}}
                    data={todayDates}
                    keyExtractor={(item) => item.id_cita + ''}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refresh}
                        />
                    }
                />
            )
            
        }
        
    </View>
    )
}


const styles = StyleSheet.create({
    input:{
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        fontSize: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        padding: 5,
        borderRadius:10
    },
    findButton:{
        width: '50%',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: 'green',
    },
    textButton:{
        color: 'white',
        textAlign: 'center',
    },
    showAllButtons:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center'
    }
})
export default DateList