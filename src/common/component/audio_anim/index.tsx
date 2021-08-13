import React from 'react';
import { Animated, View } from 'react-native';

const duration = 44
const multiPlier = 1.96
class Animator extends React.Component<{}> {
    views: Array<string> = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"]
    isUnmounted: boolean = false
    state : {direction: {[x: string]: "up" | "down"}, anim: {[x: string]: Animated.Value}}= {
        direction: {
            first: "up",
            second: "up",
            third: "down",
            fourth: "down",
            fifth: "down",
            sixth: "up",
            seventh: "up"
        },
        anim: {
            first: new Animated.Value(Math.pow(multiPlier, 2)),
            second: new Animated.Value(Math.pow(multiPlier, 3)),
            third: new Animated.Value(Math.pow(multiPlier, 4)),
            fourth: new Animated.Value(Math.pow(multiPlier, 5)),
            fifth: new Animated.Value(Math.pow(multiPlier, 4)),
            sixth: new Animated.Value(Math.pow(multiPlier, 3)),
            seventh: new Animated.Value(Math.pow(multiPlier, 2))
        }
    }

    powerOf = (value: number, times: number = 1): number => {
        if (value !== Math.pow(multiPlier, times)) {
            return this.powerOf(value, times + 1)
        }
        return times
    }

    getNext(value: Animated.Value, direction: string): {value: number, direction: string} {
        var power = this.powerOf((value as any)._value)
        power = (direction == "up") ? power + 1 : power - 1
        let val = Math.pow(multiPlier, power)
        return {value: val, direction: (val == Math.pow(multiPlier, 5) ? "down" : (val == Math.pow(multiPlier, 2)  ? "up" : direction))}
    }

    play() {
        if (this.isUnmounted) return;
        var value : {[x: string]: {value: number, direction: string}}= {}
        let {anim, direction} = {...this.state}
        for (let it of this.views) {
            value[it] = this.getNext((anim[it] as Animated.Value), direction[it])
        }
        Animated.parallel(
            [
                Animated.timing(
                    this.state.anim.first,
                    {
                        toValue: value.first.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.second,
                    {
                        toValue: value.second.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.third,
                    {
                        toValue: value.third.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.fourth,
                    {
                        toValue: value.fourth.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.fifth,
                    {
                        toValue: value.fifth.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.sixth,
                    {
                        toValue: value.sixth.value,
                        duration 
                    }
                ),
                Animated.timing(
                    this.state.anim.seventh,
                    {
                        toValue: value.seventh.value,
                        duration 
                    }
                )
            ]
        ).start(_ => {
            var direction: {[x: string]: string} = {...this.state.direction}
            for (let key in value) {
                direction[key] = value[key].direction
            }
            this.setState({direction}, () => setTimeout(() => {this.play()}, duration));
        })
    }

    componentDidMount() {
        this.play()
    }

    componentWillUnmount() {
        this.isUnmounted = true
    }

    render() {
        return(
            <View style={{height: '100%', flexDirection: 'row', alignItems: 'center', width: 320, justifyContent: 'space-between'}}>
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                
                <Animated.View style={{height: this.state.anim.first, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.second, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.third, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fourth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.fifth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.sixth, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
                <Animated.View style={{height: this.state.anim.seventh, width: 3, borderRadius: 20, backgroundColor: 'darkgray'}}></Animated.View>
            </View>
        )
    }
}

export default class MainView extends React.Component<{style: any, play: boolean}> {
    render() {
        if (this.props.play) {
            return (
                <View style={[this.props.style, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                    <Animator />
                </View>
            )
        } else {
            return <View style={this.props.style} />
        }
    }
}

