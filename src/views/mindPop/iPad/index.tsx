import React from "react";
import MindPopList from "../list";
import MindPopEdit from "../edit";
import { SafeAreaView, View } from "react-native";
import { connect } from "react-redux";
import { EditMode, AddMindPopStatus } from "../edit/reducer";
import { GetMindPopStatus } from "../list/reducer";
import { DeleteMindPopOperation } from "../list/deleteMindPopReducer";

type Props = {
	listCount: number;
	completed: boolean;
	isSelectingItem: boolean;
	listItem: object;
	[x: string]: any;
}

class iPadList extends React.Component<Props> {
	_listRef?: any = null;
	render() {
		var style: object = {};
		if (this.props.listCount > 0) {
			style = { width: 320 };
		} else {
			style = { flex: 1 };
		}
		return (
			<SafeAreaView style={{ flexDirection: "row", flex: 1 }}>
				<View style={style}>
					<MindPopList ref={(ref: any) => (this._listRef = ref)} navigation={this.props.navigation}/>
				</View>
				{this.props.listCount > 0 ? (
					<View style={{ flex: 1 }}>
						<MindPopEdit isEdit={true} {...this.props}/>
						{this.props.isSelectingItem ? (
							<View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "#00000034" }} />
						) : null}
					</View>
				) : null}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state: { [x: string]: any }) => ({
	listCount: state.listCount as number,
	completed: state.getMindPop.completed,
	isSelectingItem: state.mindPopListSelectionStatus,
	listItem: state.mindPopEditMode.selectedMindPop
});

export default connect(
	mapStateToProps
)(iPadList);
