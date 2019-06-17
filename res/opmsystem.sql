/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : opmsystem

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-06-17 20:26:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `deal_record`
-- ----------------------------
DROP TABLE IF EXISTS `deal_record`;
CREATE TABLE `deal_record` (
  `deal_id` varchar(20) NOT NULL,
  `order_id` varchar(20) DEFAULT NULL,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `information` varchar(200) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `transaction_status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`deal_id`),
  KEY `from_id` (`from_id`),
  KEY `to_id` (`to_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `deal_record_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `deal_record_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `deal_record_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `order_form` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deal_record
-- ----------------------------

-- ----------------------------
-- Table structure for `flight_com`
-- ----------------------------
DROP TABLE IF EXISTS `flight_com`;
CREATE TABLE `flight_com` (
  `flightName` varchar(40) DEFAULT NULL COMMENT '航班名',
  `userID` varchar(20) DEFAULT NULL COMMENT '用户名',
  `flightEvaluete` varchar(255) DEFAULT NULL COMMENT '航班评价',
  KEY `flightName` (`flightName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of flight_com
-- ----------------------------
INSERT INTO `flight_com` VALUES ('上海航空FM915', '嘤菜鸡', '1');
INSERT INTO `flight_com` VALUES ('上海航空FM915', '嘤菜鸡', '123');
INSERT INTO `flight_com` VALUES ('上海航空FM915', '嘤菜鸡', '123');
INSERT INTO `flight_com` VALUES ('上海航空FM915', '嘤菜鸡', '123');
INSERT INTO `flight_com` VALUES ('上海航空FM915', '嘤菜鸡', '123');

-- ----------------------------
-- Table structure for `flight_info`
-- ----------------------------
DROP TABLE IF EXISTS `flight_info`;
CREATE TABLE `flight_info` (
  `flightName` varchar(40) NOT NULL COMMENT '航班名',
  `flightClass` varchar(40) DEFAULT NULL COMMENT '航班类型',
  `flightCompany` varchar(40) DEFAULT NULL COMMENT '航空公司',
  `landingPlace` varchar(40) DEFAULT NULL COMMENT '登机地点',
  `departurePlace` varchar(40) DEFAULT NULL COMMENT '落地点',
  `landingTime` varchar(40) DEFAULT NULL COMMENT '起飞时间',
  `departureTime` varchar(40) DEFAULT NULL COMMENT '落地时间',
  `flightPrice` decimal(7,2) DEFAULT NULL COMMENT '航班价格',
  `specialTicket` tinyint(1) DEFAULT NULL COMMENT '是否特价票',
  `ticketAllowance` int(11) DEFAULT NULL COMMENT '票余量',
  PRIMARY KEY (`flightName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of flight_info
-- ----------------------------
INSERT INTO `flight_info` VALUES ('上海航空FM915', null, '上海航空', '首都国际机场T2', '萧山国际机场T3', '2019-06-21 12:10', '2019-06-21 09:45', '800.00', null, '1');
INSERT INTO `flight_info` VALUES ('东方航空MU5131', null, '东方航空', '首都国际机场T2', '萧山国际机场T3', '2019-06-21 09:25', '2019-06-21 07:00', '700.00', null, null);
INSERT INTO `flight_info` VALUES ('东方航空MU712', null, '东方航空', '首都国际机场T3', '萧山国际机场T3', '2019-06-21 12:10', '2019-06-21 09:45', '870.00', null, null);
INSERT INTO `flight_info` VALUES ('中国国航CA1701', null, '中国国航', '首都国际机场T2', '萧山国际机场T1', '2019-06-21 09:25', '2019-06-21 06:55', '730.00', null, null);
INSERT INTO `flight_info` VALUES ('中国国航CA1713', null, '中国国航', '首都国际机场T3', '萧山国际机场T1', '2019-06-22 23:35', '2019-06-22 21:45', '820.00', null, null);
INSERT INTO `flight_info` VALUES ('南方航空CZ3850', null, '南方航空', '白云国际机场T2', '萧山国际机场T3', '2019-06-22 00:30', '2019-06-21 22:30', '760.00', null, null);
INSERT INTO `flight_info` VALUES ('厦门航空MF1031', null, '厦门航空', '白云国际机场T2', '萧山国际机场T3', '2019-06-22 00:30', '2019-06-21 22:30', '760.00', null, null);
INSERT INTO `flight_info` VALUES ('海南航空HU7678', null, '海南航空', '首都国际机场T1', '萧山国际机场T3', '2019-06-22 22:20', '2019-06-22 19:55', '450.00', null, null);
INSERT INTO `flight_info` VALUES ('海南航空HU7762', null, '海南航空', '白云国际机场T2', '萧山国际机场T3', '2019-06-21 21:45', '2019-06-21 21:30', null, null, null);
INSERT INTO `flight_info` VALUES ('长龙航空GJ8987', null, '长龙航空', '首都国际机场T3', '萧山国际机场T3', '2019-06-22 01:50', '2019-06-21 23:30', '748.00', null, null);

-- ----------------------------
-- Table structure for `hotel_com`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_com`;
CREATE TABLE `hotel_com` (
  `hotelName` varchar(40) DEFAULT NULL COMMENT '酒店名',
  `userID` varchar(20) DEFAULT NULL COMMENT '用户名',
  `hotelEvaluete` varchar(255) DEFAULT NULL COMMENT '酒店评价',
  KEY `hotelName` (`hotelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of hotel_com
-- ----------------------------

-- ----------------------------
-- Table structure for `hotel_info`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_info`;
CREATE TABLE `hotel_info` (
  `hotelName` varchar(40) DEFAULT NULL COMMENT '酒店名',
  `hotelLocation` varchar(40) DEFAULT NULL COMMENT '酒店位置',
  `hotelScore` int(11) DEFAULT NULL COMMENT '酒店评分',
  `hotelStar` int(11) DEFAULT NULL COMMENT '酒店星级',
  `hotelPrice` decimal(7,2) DEFAULT NULL COMMENT '酒店价格',
  `checkIn` datetime DEFAULT NULL COMMENT '入住时间',
  `checkOut` datetime DEFAULT NULL COMMENT '退房时间',
  `specialRoom` tinyint(1) DEFAULT NULL COMMENT '是否特价房',
  `roomAllowance` int(11) DEFAULT NULL COMMENT '房间余量',
  `hotelImg1` varchar(100) DEFAULT NULL,
  `hotelImg2` varchar(100) DEFAULT NULL,
  `type` int(10) DEFAULT NULL,
  `hotelInstr` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of hotel_info
-- ----------------------------
INSERT INTO `hotel_info` VALUES ('杭州马可波罗假日酒店', '杭州 上城区 平海路38号，近浣纱路口，地铁1号线龙翔桥站D出口。', '96', '3', '800.00', null, null, null, '3', '../images/hotel/makeboluo_1.jpg', '../images/hotel/makeboluo_2.jpg', '1', '杭州马可波罗假日酒店位于市中心西湖边的平海路上，距地铁1号线龙翔桥站D出口仅300米左右。2013年所有客房全新装修，全新配备消毒柜、加湿器、智能马桶盖。这是一家欧式经典风格的商务酒店，由马可波罗酒店管理公司经营管理，获“中国饭店金星奖”、“游客满意服务企业”等多项殊荣。酒店采用意大利风格设计，体现了“欧洲风格、绿色生活、高尚品位、自由浪漫”的特色。客房宽敞温馨，配备优质床上用品及高级洗浴用品。酒店另设香都中餐厅、吉雅家精致日料餐厅、地道意大利薄底披萨啤酒吧、地中海咖啡厅、全湖景豪华宴会厅、精品商场、各类会议室、大型地下停车库等配套设施，让中外宾客享受方便、舒适、安静、周到的优质服务。\n');
INSERT INTO `hotel_info` VALUES ('杭州马可波罗假日酒店', '杭州 上城区 平海路38号，近浣纱路口，地铁1号线龙翔桥站D出口。', '96', '3', '900.00', null, null, null, '2', '../images/hotel/makeboluo_1.jpg', '../images/hotel/makeboluo_2.jpg', '2', '杭州马可波罗假日酒店位于市中心西湖边的平海路上，距地铁1号线龙翔桥站D出口仅300米左右。2013年所有客房全新装修，全新配备消毒柜、加湿器、智能马桶盖。这是一家欧式经典风格的商务酒店，由马可波罗酒店管理公司经营管理，获“中国饭店金星奖”、“游客满意服务企业”等多项殊荣。酒店采用意大利风格设计，体现了“欧洲风格、绿色生活、高尚品位、自由浪漫”的特色。客房宽敞温馨，配备优质床上用品及高级洗浴用品。酒店另设香都中餐厅、吉雅家精致日料餐厅、地道意大利薄底披萨啤酒吧、地中海咖啡厅、全湖景豪华宴会厅、精品商场、各类会议室、大型地下停车库等配套设施，让中外宾客享受方便、舒适、安静、周到的优质服务。\n');
INSERT INTO `hotel_info` VALUES ('杭州中山国际大酒店', '杭州 上城区 平海路15号，近御街，1号线地铁口龙翔桥站D出口。', '90', '2', '400.00', null, null, null, '4', '../images/hotel/zhongshanguoji_1.jpg', '../images/hotel/zhongshanguoji_2.jpg', '1', '杭州中山国际大酒店位于繁华的商业街平海路口，酒店距西湖及湖滨步行街，延安路商业街近在咫尺。四周商家林立，交通便捷，酒店至萧山机场的专线大巴，每隔30分钟一班。店内有独立停车场。为会议、商务、旅游宾客理想的下榻场所。酒店有不同类型的豪华标准房及豪华套间，大小豪华会议室4个，有可容纳200人左右的湖景豪华多功能厅及可容纳25人-80人的中小型会议室。酒店的娱乐中心有棋牌室、KTV等各种娱乐服务项目。酒店中山官邸6号中餐厅是以新派杭菜、创意菜、粤菜为主的高档会所式餐厅，有大小不同的6个豪华包厢。顶楼更有可容纳200人同时用餐的湖景宴会厅。');
INSERT INTO `hotel_info` VALUES ('杭州中山国际大酒店', '杭州 上城区 平海路15号，近御街，1号线地铁口龙翔桥站D出口。', '90', '2', '500.00', null, null, null, '4', '../images/hotel/zhongshanguoji_1.jpg', '../images/hotel/zhongshanguoji_2.jpg', '2', '杭州中山国际大酒店位于繁华的商业街平海路口，酒店距西湖及湖滨步行街，延安路商业街近在咫尺。四周商家林立，交通便捷，酒店至萧山机场的专线大巴，每隔30分钟一班。店内有独立停车场。为会议、商务、旅游宾客理想的下榻场所。酒店有不同类型的豪华标准房及豪华套间，大小豪华会议室4个，有可容纳200人左右的湖景豪华多功能厅及可容纳25人-80人的中小型会议室。酒店的娱乐中心有棋牌室、KTV等各种娱乐服务项目。酒店中山官邸6号中餐厅是以新派杭菜、创意菜、粤菜为主的高档会所式餐厅，有大小不同的6个豪华包厢。顶楼更有可容纳200人同时用餐的湖景宴会厅。');
INSERT INTO `hotel_info` VALUES ('杭州中山国际大酒店', '杭州 上城区 平海路15号，近御街，1号线地铁口龙翔桥站D出口。', '90', '2', '600.00', null, null, null, '4', '../images/hotel/zhongshanguoji_1.jpg', '../images/hotel/zhongshanguoji_2.jpg', '3', '杭州中山国际大酒店位于繁华的商业街平海路口，酒店距西湖及湖滨步行街，延安路商业街近在咫尺。四周商家林立，交通便捷，酒店至萧山机场的专线大巴，每隔30分钟一班。店内有独立停车场。为会议、商务、旅游宾客理想的下榻场所。酒店有不同类型的豪华标准房及豪华套间，大小豪华会议室4个，有可容纳200人左右的湖景豪华多功能厅及可容纳25人-80人的中小型会议室。酒店的娱乐中心有棋牌室、KTV等各种娱乐服务项目。酒店中山官邸6号中餐厅是以新派杭菜、创意菜、粤菜为主的高档会所式餐厅，有大小不同的6个豪华包厢。顶楼更有可容纳200人同时用餐的湖景宴会厅。');
INSERT INTO `hotel_info` VALUES ('浙江西湖山庄', '杭州 西湖区 北山街84号，近断桥。', '99', '5', '1000.00', null, null, null, '1', '../images/hotel/xihushanzhuang.jpg', '../images/hotel/xihushanzhuang2.jpg', '1', '浙江西湖山庄座落于北山路，紧邻黄龙吐翠、宝石流霞、曲院风荷、岳庙等名胜景点，登高远望可尽揽西湖美景，临窗可赏断桥、孤山景致。这里作为省国宾接待中心，隶属于省机关事务管理局。山庄整体掩映山林、旷奥有度，园中景色宜人，陈设典雅，宾客落榻于西湖山庄，赏法国梧桐一路，游北山历史文化街，醉西湖微风半床。浙江西湖山庄内还有“五四宪法历史资料陈列馆”；这里凭借建筑掩映山林的特点，成为了天养胜境，有不同类型和规格的客房，并提供规范化和个性化的服务，使你能真正享受到高规格国宾礼遇。浙江西湖山庄共设西子楼、晨霞楼、晓月楼等五座主体建筑，拥有风格各异的大小包厢、宴会厅、西餐厅、中餐厅等。其中锦华厅可最多容纳600人。山庄将以别致素雅的景致与高端优质的服务，为你留下独特的杭州记忆、美丽的中国印象。\n');
INSERT INTO `hotel_info` VALUES ('浙江西湖山庄', '杭州 西湖区 北山街84号，近断桥。', '99', '5', '1200.00', null, null, null, '1', '../images/hotel/xihushanzhuang.jpg', '../images/hotel/xihushanzhuang2.jpg', '2', '浙江西湖山庄座落于北山路，紧邻黄龙吐翠、宝石流霞、曲院风荷、岳庙等名胜景点，登高远望可尽揽西湖美景，临窗可赏断桥、孤山景致。这里作为省国宾接待中心，隶属于省机关事务管理局。山庄整体掩映山林、旷奥有度，园中景色宜人，陈设典雅，宾客落榻于西湖山庄，赏法国梧桐一路，游北山历史文化街，醉西湖微风半床。浙江西湖山庄内还有“五四宪法历史资料陈列馆”；这里凭借建筑掩映山林的特点，成为了天养胜境，有不同类型和规格的客房，并提供规范化和个性化的服务，使你能真正享受到高规格国宾礼遇。浙江西湖山庄共设西子楼、晨霞楼、晓月楼等五座主体建筑，拥有风格各异的大小包厢、宴会厅、西餐厅、中餐厅等。其中锦华厅可最多容纳600人。山庄将以别致素雅的景致与高端优质的服务，为你留下独特的杭州记忆、美丽的中国印象。\n');
INSERT INTO `hotel_info` VALUES ('浙江西湖山庄', '杭州 西湖区 北山街84号，近断桥。', '99', '5', '1400.00', null, null, null, '1', '../images/hotel/xihushanzhuang.jpg', '../images/hotel/xihushanzhuang2.jpg', '3', '浙江西湖山庄座落于北山路，紧邻黄龙吐翠、宝石流霞、曲院风荷、岳庙等名胜景点，登高远望可尽揽西湖美景，临窗可赏断桥、孤山景致。这里作为省国宾接待中心，隶属于省机关事务管理局。山庄整体掩映山林、旷奥有度，园中景色宜人，陈设典雅，宾客落榻于西湖山庄，赏法国梧桐一路，游北山历史文化街，醉西湖微风半床。浙江西湖山庄内还有“五四宪法历史资料陈列馆”；这里凭借建筑掩映山林的特点，成为了天养胜境，有不同类型和规格的客房，并提供规范化和个性化的服务，使你能真正享受到高规格国宾礼遇。浙江西湖山庄共设西子楼、晨霞楼、晓月楼等五座主体建筑，拥有风格各异的大小包厢、宴会厅、西餐厅、中餐厅等。其中锦华厅可最多容纳600人。山庄将以别致素雅的景致与高端优质的服务，为你留下独特的杭州记忆、美丽的中国印象。\n');
INSERT INTO `hotel_info` VALUES ('杭州中维香溢大酒店', '杭州 上城区 解放路108号，近浙医二院。', '94', '4', '700.00', null, null, null, '2', '../images/hotel/zhongweixiangyi_1.jpg', '../images/hotel/zhongweixiangyi_2.jpg', '2', '杭州中维香溢大酒店位于杭州商业繁荣的市中心，西湖至钱江CBD交通枢纽中段，交通出行十分便捷。酒店为“中维酒店集团”旗下成员酒店，拥有三百余间各式精美客房，可照顾商务往来和休闲度假的每个细节。多种先进科技降噪手段，即使身处闹市也可独享静谧安宁的休憩空间。4间高级食肆风味多样，高雅地道的中餐厅、日式料理，优雅浓情的咖啡阁、大堂酒廊，“香溢大厨”将技术与艺术用心融合，为嘉宾提供各种精致美味佳肴。11个安静独立的会议空间，既有可同时容纳400人的大型多功能宴会厅，亦有面积不等的中小型会议室，适宜不同规模的公司会议、商务会展、培训研讨、高管聚会等，也是婚礼、庆典及主题餐会之上选。');
INSERT INTO `hotel_info` VALUES ('杭州中维香溢大酒店', '杭州 上城区 解放路108号，近浙医二院。', '94', '4', '740.00', null, null, null, '2', '../images/hotel/zhongweixiangyi_1.jpg', '../images/hotel/zhongweixiangyi_2.jpg', '3', '杭州中维香溢大酒店位于杭州商业繁荣的市中心，西湖至钱江CBD交通枢纽中段，交通出行十分便捷。酒店为“中维酒店集团”旗下成员酒店，拥有三百余间各式精美客房，可照顾商务往来和休闲度假的每个细节。多种先进科技降噪手段，即使身处闹市也可独享静谧安宁的休憩空间。4间高级食肆风味多样，高雅地道的中餐厅、日式料理，优雅浓情的咖啡阁、大堂酒廊，“香溢大厨”将技术与艺术用心融合，为嘉宾提供各种精致美味佳肴。11个安静独立的会议空间，既有可同时容纳400人的大型多功能宴会厅，亦有面积不等的中小型会议室，适宜不同规模的公司会议、商务会展、培训研讨、高管聚会等，也是婚礼、庆典及主题餐会之上选。');
INSERT INTO `hotel_info` VALUES ('杭州中维香溢大酒店', '杭州 上城区 解放路108号，近浙医二院。', '94', '4', '620.00', null, null, null, '2', '../images/hotel/zhongweixiangyi_1.jpg', '../images/hotel/zhongweixiangyi_2.jpg', '1', '杭州中维香溢大酒店位于杭州商业繁荣的市中心，西湖至钱江CBD交通枢纽中段，交通出行十分便捷。酒店为“中维酒店集团”旗下成员酒店，拥有三百余间各式精美客房，可照顾商务往来和休闲度假的每个细节。多种先进科技降噪手段，即使身处闹市也可独享静谧安宁的休憩空间。4间高级食肆风味多样，高雅地道的中餐厅、日式料理，优雅浓情的咖啡阁、大堂酒廊，“香溢大厨”将技术与艺术用心融合，为嘉宾提供各种精致美味佳肴。11个安静独立的会议空间，既有可同时容纳400人的大型多功能宴会厅，亦有面积不等的中小型会议室，适宜不同规模的公司会议、商务会展、培训研讨、高管聚会等，也是婚礼、庆典及主题餐会之上选。');
INSERT INTO `hotel_info` VALUES ('杭州花家山庄', '杭州 西湖区 三台山路25号，近花港观鱼、苏堤、雷峰塔。', '96', '3', '750.00', null, null, null, '5', '../images/hotel/huajiashanzhuang_1.jpg', '../images/hotel/huajiashanzhuang_2.jpg', '2', '杭州花家山庄位于西子湖畔，紧邻灵隐寺、花港观鱼、太子湾公园、雷峰塔、动物园、杭州花圃、植物园等，被誉为“都市里的桃源”。全新装修后房间及园林全面提升。房间用材考究，卫浴等设施都选用国际知名品牌。“青山滴翠湖水碧，绝幽山庄名花家”，这是金庸先生对山庄风貌和景致的由衷赞叹。山庄占地共14公顷，绿地面积95%以上，负氧离子含量达到了4000以上，小楼密处环抱一眼泉水，此曰雅谷泉，与虎跑泉同气连枝，庄内古木参天，绿树成荫，具有浓郁的江南园林风格。');
INSERT INTO `hotel_info` VALUES ('杭州花家山庄', '杭州 西湖区 三台山路25号，近花港观鱼、苏堤、雷峰塔。', '96', '3', '800.00', null, null, null, '5', '../images/hotel/huajiashanzhuang_1.jpg', '../images/hotel/huajiashanzhuang_2.jpg', '3', '杭州花家山庄位于西子湖畔，紧邻灵隐寺、花港观鱼、太子湾公园、雷峰塔、动物园、杭州花圃、植物园等，被誉为“都市里的桃源”。全新装修后房间及园林全面提升。房间用材考究，卫浴等设施都选用国际知名品牌。“青山滴翠湖水碧，绝幽山庄名花家”，这是金庸先生对山庄风貌和景致的由衷赞叹。山庄占地共14公顷，绿地面积95%以上，负氧离子含量达到了4000以上，小楼密处环抱一眼泉水，此曰雅谷泉，与虎跑泉同气连枝，庄内古木参天，绿树成荫，具有浓郁的江南园林风格。');
INSERT INTO `hotel_info` VALUES ('杭州花家山庄', '杭州 西湖区 三台山路25号，近花港观鱼、苏堤、雷峰塔。', '96', '3', '680.00', null, null, null, '5', '../images/hotel/huajiashanzhuang_1.jpg', '../images/hotel/huajiashanzhuang_2.jpg', '1', '杭州花家山庄位于西子湖畔，紧邻灵隐寺、花港观鱼、太子湾公园、雷峰塔、动物园、杭州花圃、植物园等，被誉为“都市里的桃源”。全新装修后房间及园林全面提升。房间用材考究，卫浴等设施都选用国际知名品牌。“青山滴翠湖水碧，绝幽山庄名花家”，这是金庸先生对山庄风貌和景致的由衷赞叹。山庄占地共14公顷，绿地面积95%以上，负氧离子含量达到了4000以上，小楼密处环抱一眼泉水，此曰雅谷泉，与虎跑泉同气连枝，庄内古木参天，绿树成荫，具有浓郁的江南园林风格。');
INSERT INTO `hotel_info` VALUES ('杭州汇和君亭酒店', '杭州 江干区 新风路589号, 距地铁站步行10分钟。', '88', '1', '300.00', null, null, null, '5', '../images/hotel/huihejunting_1.jpg', '../images/hotel/huihejunting_2.jpg', '1', '酒店由浙江君亭酒店管理股份有限公司管理，酒店定位于城市精品及设计型酒店。旨在为客人打造优雅商旅之行程，强调私密、休闲、宁静、轻松的商旅环境。酒店内随处可见东南亚风格的陈设布置，具浓郁的东方休闲文化氛围；提供方便、亲切的人性化服务，特别关注住店客人的安全及隐私，设置电梯门禁卡系统；高性价比的入住体验，使君亭酒店成为中高端商务客人的“城市桃源”。 在客房体验方面，与金可儿品牌合作开发“君亭之梦”，健康舒适的睡眠体验，卫生间热带雨林花洒及充足水压，打造了酣畅淋浴体验；37寸及以上液晶电视机，Iphone home，冰柜饮品畅饮，无线网络全馆覆盖……无疑是超值享受。');
INSERT INTO `hotel_info` VALUES ('杭州汇和君亭酒店', '杭州 江干区 新风路589号, 距地铁站步行10分钟。', '88', '1', '380.00', null, null, null, '5', '../images/hotel/huihejunting_1.jpg', '../images/hotel/huihejunting_2.jpg', '2', '酒店由浙江君亭酒店管理股份有限公司管理，酒店定位于城市精品及设计型酒店。旨在为客人打造优雅商旅之行程，强调私密、休闲、宁静、轻松的商旅环境。酒店内随处可见东南亚风格的陈设布置，具浓郁的东方休闲文化氛围；提供方便、亲切的人性化服务，特别关注住店客人的安全及隐私，设置电梯门禁卡系统；高性价比的入住体验，使君亭酒店成为中高端商务客人的“城市桃源”。 在客房体验方面，与金可儿品牌合作开发“君亭之梦”，健康舒适的睡眠体验，卫生间热带雨林花洒及充足水压，打造了酣畅淋浴体验；37寸及以上液晶电视机，Iphone home，冰柜饮品畅饮，无线网络全馆覆盖……无疑是超值享受。');
INSERT INTO `hotel_info` VALUES ('杭州汇和君亭酒店', '杭州 江干区 新风路589号, 距地铁站步行10分钟。', '88', '1', '400.00', null, null, null, '5', '../images/hotel/huihejunting_1.jpg', '../images/hotel/huihejunting_2.jpg', '3', '酒店由浙江君亭酒店管理股份有限公司管理，酒店定位于城市精品及设计型酒店。旨在为客人打造优雅商旅之行程，强调私密、休闲、宁静、轻松的商旅环境。酒店内随处可见东南亚风格的陈设布置，具浓郁的东方休闲文化氛围；提供方便、亲切的人性化服务，特别关注住店客人的安全及隐私，设置电梯门禁卡系统；高性价比的入住体验，使君亭酒店成为中高端商务客人的“城市桃源”。 在客房体验方面，与金可儿品牌合作开发“君亭之梦”，健康舒适的睡眠体验，卫生间热带雨林花洒及充足水压，打造了酣畅淋浴体验；37寸及以上液晶电视机，Iphone home，冰柜饮品畅饮，无线网络全馆覆盖……无疑是超值享受。');
INSERT INTO `hotel_info` VALUES ('杭州马可波罗假日酒店', '杭州 上城区 平海路38号，近浣纱路口，地铁1号线龙翔桥站D出口。', '96', '3', '1000.00', null, null, null, '3', '../images/hotel/makeboluo_1.jpg', '../images/hotel/makeboluo_2.jpg', '3', '杭州马可波罗假日酒店位于市中心西湖边的平海路上，距地铁1号线龙翔桥站D出口仅300米左右。2013年所有客房全新装修，全新配备消毒柜、加湿器、智能马桶盖。这是一家欧式经典风格的商务酒店，由马可波罗酒店管理公司经营管理，获“中国饭店金星奖”、“游客满意服务企业”等多项殊荣。酒店采用意大利风格设计，体现了“欧洲风格、绿色生活、高尚品位、自由浪漫”的特色。客房宽敞温馨，配备优质床上用品及高级洗浴用品。酒店另设香都中餐厅、吉雅家精致日料餐厅、地道意大利薄底披萨啤酒吧、地中海咖啡厅、全湖景豪华宴会厅、精品商场、各类会议室、大型地下停车库等配套设施，让中外宾客享受方便、舒适、安静、周到的优质服务。\n');

-- ----------------------------
-- Table structure for `order_form`
-- ----------------------------
DROP TABLE IF EXISTS `order_form`;
CREATE TABLE `order_form` (
  `order_id` varchar(20) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `goods_name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `receive_adr` varchar(200) NOT NULL,
  `current_status` int(1) NOT NULL,
  `created_time` datetime NOT NULL,
  `refund_reason` varchar(200) DEFAULT NULL,
  `refund_time` datetime DEFAULT NULL,
  `refund_status` int(1) NOT NULL DEFAULT '0',
  `complain` varchar(500) DEFAULT NULL,
  `complain_time` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `seller_id` (`seller_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `order_form_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_form_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order_form
-- ----------------------------
INSERT INTO `order_form` VALUES ('201906068003', '2', '1', '商务大床房7.1~7.2', '200', '', '0', '2019-06-07 12:41:11', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068004', '2', '1', '商务大床房7.2~7.3', '201', '', '1', '2019-06-07 12:41:11', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068005', '2', '1', '商务大床房7.3~7.4', '202', '', '2', '2019-06-07 12:41:11', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068006', '2', '1', '商务大床房7.4~7.5', '203', '', '3', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068007', '2', '1', '商务大床房7.5~7.6', '204', '', '4', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068008', '2', '1', '商务大床房7.6~7.7', '205', '', '5', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068009', '2', '1', '商务大床房7.7~7.8', '206', '', '0', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068010', '2', '1', '商务大床房7.8~7.9', '207', '', '1', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068011', '2', '1', '商务大床房7.9~7.10', '208', '', '2', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068012', '2', '1', '商务大床房7.10~7.11', '209', '', '4', '2019-06-07 12:41:12', '', null, '1', ' ', '2019-06-11 18:10:20');
INSERT INTO `order_form` VALUES ('201906068013', '2', '1', '商务大床房7.11~7.12', '210', '', '4', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068014', '2', '1', '商务大床房7.12~7.13', '211', '', '5', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068015', '2', '1', '商务大床房7.13~7.14', '212', '', '0', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068016', '2', '1', '商务大床房7.14~7.15', '213', '', '1', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068017', '2', '1', '商务大床房7.15~7.16', '214', '', '2', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068018', '2', '1', '商务大床房7.16~7.17', '215', '', '3', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068019', '2', '1', '商务大床房7.17~7.18', '216', '', '4', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068020', '2', '1', '商务大床房7.18~7.19', '217', '', '5', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068021', '2', '1', '商务大床房7.19~7.20', '218', '', '0', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068022', '2', '1', '商务大床房7.20~7.21', '219', '', '1', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068023', '2', '1', '商务大床房7.21~7.22', '220', '', '2', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068024', '2', '1', '商务大床房7.22~7.23', '221', '', '3', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068025', '2', '1', '商务大床房7.23~7.24', '222', '', '4', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068026', '2', '1', '商务大床房7.24~7.25', '223', '', '5', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068027', '2', '1', '商务大床房7.25~7.26', '224', '', '0', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068028', '2', '1', '商务大床房7.26~7.27', '225', '', '1', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068029', '2', '1', '商务大床房7.27~7.28', '226', '', '2', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068030', '2', '1', '商务大床房7.28~7.29', '227', '', '3', '2019-06-07 12:41:12', null, null, '0', null, null);
INSERT INTO `order_form` VALUES ('201906068031', '2', '1', '商务大床房7.29~7.30', '228', '', '4', '2019-06-07 12:41:13', null, null, '0', ' ', '2019-06-11 16:09:13');
INSERT INTO `order_form` VALUES ('201906068032', '2', '1', '商务大床房7.30~7.31', '229', '', '5', '2019-06-07 12:41:13', null, null, '0', null, null);

-- ----------------------------
-- Table structure for `sys_statistics`
-- ----------------------------
DROP TABLE IF EXISTS `sys_statistics`;
CREATE TABLE `sys_statistics` (
  `total_user` int(11) DEFAULT NULL COMMENT '总用户',
  `daily_trading_volume` int(11) DEFAULT NULL COMMENT '日交易量',
  `active_user` int(11) DEFAULT NULL COMMENT '活跃用户',
  `constraint_admin` int(11) DEFAULT NULL COMMENT '受约束的管理员',
  `week_regist` int(11) DEFAULT NULL COMMENT '一周注册量',
  `cash_to_cash_ratio` int(11) DEFAULT NULL COMMENT '体现比',
  `feedback_number` int(11) DEFAULT NULL COMMENT '反馈数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统后台统计信息表';

-- ----------------------------
-- Records of sys_statistics
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
  `password` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '密码',
  `realName` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '姓名',
  `licenseNumber` varchar(18) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '证件号',
  `dateOfBirth` char(12) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '出生日期',
  `phoneNumber` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '手机号',
  `emailAddr` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '邮箱',
  `typeOfUser` int(11) DEFAULT NULL COMMENT '用户类型',
  `balance` decimal(19,2) DEFAULT NULL COMMENT '余额',
  `payPassword` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '支付密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10087 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '嘤嘤嘤菜鸡', '123', '嘤菜鸡', '88888888', '1999-07-', '', '', '1', '2500.00', 'httnb');
INSERT INTO `user` VALUES ('2', '锦江之星大酒店', '123', '胡图图', null, null, null, null, '3', '3000.00', 'zjynb');
INSERT INTO `user` VALUES ('10086', '交易中介账户', '123', null, null, null, null, null, null, '1445.00', null);
