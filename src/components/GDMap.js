import React, { Component } from "react";
import AMap from "AMap";
import { Input, List } from "antd";

export default class GDMap extends Component {
  state = {
    amap: null,
    center: [120.153576, 30.287459],
    searchData: [],
    markers: [],
    placeSearch: null
  }
  componentDidMount() {
    const { mid, zoom } = this.props;
    const { center } = this.state;
    const amap = new AMap.Map(mid, {
      center,
      zoom,
      lang: "zh_cn"
    });
    amap.plugin("AMap.Geolocation", () => {
      const geolocation = new AMap.Geolocation();
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, "complete", data => {
        this.setState({
          center: [data.position.lng, data.position.lat]
        });
        amap.setCenter([data.position.lng, data.position.lat]);
        AMap.plugin("AMap.PlaceSearch", () => {
          //构造地点查询类
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 50,
            type: "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施",
            city: data.addressComponent.city,
            citylimit: true,
            map: amap
          });
          this.setState({
            placeSearch
          });
          var cpoint = [data.position.lng, data.position.lat]; //中心点坐标
          placeSearch.searchNearBy("", cpoint, 200, (status, result) => {
            this.searchHandle(status, result, amap);
          });
        });
      });
      AMap.event.addListener(geolocation, "error", err => {
        console.log(err);
      });
    });
    this.setState({
      amap
    });
  }
  choiceAddress(item) {
    this.props.onChange(item);
  }
  searchHandle(status, result, amap) {
    if (status === "complete" && result.info === "OK" && result.poiList) {
      this.setState({
        searchData: [...result.poiList.pois]
      });
    }
  }
  iptSearch(value) {
    this.state.placeSearch.search(value, (status, result) => {
      this.searchHandle(status, result, this.state.amap);
    });
  }
  render() {
    const { mid, width, height } = this.props;
    const { searchData } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <div
          id={ mid }
          style={{ width: width + "px", height: height + "px", margin: "0 auto" }}></div>
        <div style={{ position: "absolute", left: "50%", marginLeft: "-380px", top: "20px", width: "340px", zIndex: 9999 }}>
          <Input.Search onSearch={ value => { this.iptSearch(value); } } />
          <List
            style={{ maxHeight: "400px", overflow: "auto", marginTop: "20px", backgroundColor: "#fff", display: searchData && searchData.length > 0 ? "block" : "none" }}
            itemLayout="horizontal"
            dataSource={ searchData }
            renderItem={ item => (
              <List.Item
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
                onClick={ () => { this.choiceAddress(item); } }>
                <List.Item.Meta
                  title={ item.name }
                  description={ item.address } />
              </List.Item>
            ) }  />
        </div>
      </div>
    );
  }
}
GDMap.defaultProps = {
  width: 800,
  height: 600,
  mid: "amap",
  zoom: 18,
};
