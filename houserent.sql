/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 50628
Source Host           : localhost:3306
Source Database       : houserent

Target Server Type    : MYSQL
Target Server Version : 50628
File Encoding         : 65001

Date: 2016-06-07 20:02:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `t_customer`
-- ----------------------------
DROP TABLE IF EXISTS `t_customer`;
CREATE TABLE `t_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `honstLevel` varchar(255) DEFAULT NULL,
  `lastModifyTime` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `payTimes` int(11) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `serviceSatisfy` double DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `totalPay` double DEFAULT NULL,
  `valuelevel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_customer
-- ----------------------------
INSERT INTO `t_customer` VALUES ('2', '广西省钦州市', '2016-05-09 19:17:29', '5555555', '等级A', '2016-05-11 19:17:45', '张三', '啦啦啦啦啦', '4', '555555', '89', '男', '800', '7');
INSERT INTO `t_customer` VALUES ('3', ' 河北省邯郸市', '2016-05-02 19:19:32', '33333', '等级B', '2016-05-11 19:19:48', '李四', '拉阿拉拉拉', '6', '3333333', '90', '女', '899', '9');
INSERT INTO `t_customer` VALUES ('4', '北京市', '2016-04-25 19:21:35', '9999999', '等级A', '2016-05-18 19:21:50', '王五', '哈哈哈', '3', '666666', '80', '男', '900', '9');
INSERT INTO `t_customer` VALUES ('5', '广西钦州市', '2016-05-02 00:00:00', '916356537@qq.com', '等级C', '2016-05-17 16:35:31', '陈柳羽', '很不错的消息', '5', '18303091358', '80', '女', '900', '8');

-- ----------------------------
-- Table structure for `t_house`
-- ----------------------------
DROP TABLE IF EXISTS `t_house`;
CREATE TABLE `t_house` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` int(11) DEFAULT NULL,
  `basicImg` varchar(255) DEFAULT NULL,
  `basicInfo` varchar(255) DEFAULT NULL,
  `detailInfo` varchar(1024) DEFAULT NULL,
  `direction` varchar(255) DEFAULT NULL,
  `endPoint` double DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `hall` int(11) DEFAULT NULL,
  `houseSource` int(11) DEFAULT NULL,
  `linkMan` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `pic01` varchar(255) DEFAULT NULL,
  `pic02` varchar(255) DEFAULT NULL,
  `pic03` varchar(255) DEFAULT NULL,
  `pic04` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `proportation` int(11) DEFAULT NULL,
  `pubDate` datetime DEFAULT NULL,
  `startPoint` double DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `way` int(11) DEFAULT NULL,
  `payWay_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKA05D0395DB1250C2` (`payWay_id`),
  CONSTRAINT `FKA05D0395DB1250C2` FOREIGN KEY (`payWay_id`) REFERENCES `t_payway` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_house
-- ----------------------------
INSERT INTO `t_house` VALUES ('2', '2', 'images/house/detail01.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '<p> 1、小区位置好，社区成熟，环境安静，集中供暖，绿化面积大，物业管理完善，楼道干净，小区有健身器材，社区配套有：社区超市，水果店以及多家饭馆，和农贸菜市场，生活非常舒适,购物方便!</p>\r\n								<p> 2、房子装修非常不错，我已经实地去看过房子，是业主首次出租，房间保持的很干净，温馨舒适，南北通透，采光明亮，可以商住两用，整体厨房，24小时热水，基本可以随时入住！</p>\r\n<p> 1、小区位置好，社区成熟，环境安静，集中供暖，绿化面积大，物业管理完善，楼道干净，小区有健身器材，社区配套有：社区超市，水果店以及多家饭馆，和农贸菜市场，生活非常舒适,购物方便!</p>\r\n								<p> 2、房子装修非常不错，我已经实地去看过房子，是业主首次出租，房间保持的很干净，温馨舒适，南北通透，采光明亮，可以商住两用，整体厨房，24小时热水，基本可以随时入住！</p>\r\n								<p> 3、小区周边交通方便，出门就有公交车站，步行10分钟就到地铁站口，出行十分方便，临近西三环，紫竹桥，花园桥，四通八达，去哪里的车都有！</p>\r\n								<p> 4、小区附近有华普超市，物美超市，苏宁电器等，欧尚商场，家乐福超市，小区紧挨学校有：海淀实验小学、海淀实验中学、理工附小和附中等，非常适合陪读家庭的居住！</p>\r\n								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '1', '1', '张三', '大兴附近地铁站', 'images/house/detail01.jpg', 'images/house/detail02.jpg', 'images/house/detail03.jpg', 'images/house/detail04.jpg', '1000', '100', '2016-05-16 17:57:46', '104.701711', '2', '18303091358', '海兴小区临海小屋', '3', null);
INSERT INTO `t_house` VALUES ('3', '1', 'images/house/h101.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '2', '小鱼', '大兴附近地铁站', 'images/house/h101.jpg', 'images/house/h102.jpg', 'images/house/h103.jpg', 'images/house/h104.jpg', '2000', '150', '2016-05-11 17:57:51', '104.701711', '2', '18303091358', '海兴小区临海小屋', '1', null);
INSERT INTO `t_house` VALUES ('5', '2', 'images/house/h301.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '4', '1', '小鱼', '大兴附近地铁站', 'images/house/h302.jpg', 'images/house/h303.jpg', 'images/house/h305.jpg', 'images/house/h301.jpg', '1500', '80', '2016-05-04 17:58:02', '104.701711', '2', '18303091358', '海兴小区临海小屋', '1', null);
INSERT INTO `t_house` VALUES ('6', '5', 'images/house/h401.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '2', '小雨', '大兴附近地铁站', 'images/house/h401.jpg', 'images/house/h402.jpg', 'images/house/h403.jpg', 'images/house/h404.jpg', '2000', '100', '2016-05-18 17:58:06', '104.701711', '1', '18303091358', '海兴小区临海小屋', '3', null);
INSERT INTO `t_house` VALUES ('7', '2', 'images/house/h501.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '1', '1', '王青', '大兴附近地铁站', 'images/house/h502.jpg', 'images/house/h503.jpg', 'images/house/h504.jpg', 'images/house/h501.jpg', '400', '90', '2016-05-02 17:58:11', '104.701711', '1', '18303091358', '海兴小区临海小屋', '2', null);
INSERT INTO `t_house` VALUES ('8', '3', 'images/house/h601.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '2', '小鱼', '大兴附近地铁站', 'images/house/h601.jpg', 'images/house/h603.jpg', 'images/house/h604.jpg', 'images/house/h502.jpg', '2000', '130', '2016-05-16 17:58:16', '104.701711', '1', '18303091358', '海兴小区临海小屋', '1', null);
INSERT INTO `t_house` VALUES ('9', '2', 'images/house/h701.png', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '3', '1', '刘开明', '大兴附近地铁站', 'images/house/h701.png', 'images/house/h702.png', 'images/house/h703.png', 'images/house/h704.png', '800', '110', '2016-05-05 17:58:21', '104.701711', '1', '18303091358', '海兴小区临海小屋', '3', null);
INSERT INTO `t_house` VALUES ('10', '1', 'images/house/h801.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '2', '小鱼', '大兴附近地铁站', 'images/house/h802.jpg', 'images/house/h803.jpg', 'images/house/h804.jpg', 'images/house/h805.jpg', '900', '200', '2016-05-07 17:58:25', '104.701711', '1', '18303091358', '海兴小区临海小屋', '2', null);
INSERT INTO `t_house` VALUES ('11', '2', 'images/house/h901.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '3', '2', '林晓或', '大兴附近地铁站', 'images/house/h901.jpg', 'images/house/h902.jpg', 'images/house/h903.jpg', 'images/house/h904.jpg', '2000', '100', '2016-05-09 17:58:30', '104.701711', '1', '18303091358', '海兴小区临海小屋', '1', null);
INSERT INTO `t_house` VALUES ('12', '4', 'images/house/h1001.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '1', '张晓彤', '大兴附近地铁站', 'images/house/h1002.jpg', 'images/house/h1003.jpg', 'images/house/h1004.jpg', 'images/house/h1001.jpg', '2500', '105', '2016-05-20 17:58:35', '104.701711', '1', '18303091358', '海兴小区临海小屋', '2', null);
INSERT INTO `t_house` VALUES ('13', '2', 'images/house/h1101.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '4', '2', '白降雪', '大兴附近地铁站', 'images/house/h1101.jpg', 'images/house/h1102.jpg', 'images/house/h1103.jpg', 'images/house/h1104.jpg', '3000', '160', '2016-05-18 17:58:39', '104.701711', '0', '18303091358', '海兴小区临海小屋', '3', null);
INSERT INTO `t_house` VALUES ('14', '8', 'images/house/h901.jpg', '小区位置好，社区成熟，环境安静，集中供暖，绿化面积大', '								<p> 5.诚意租的话，价格还能跟业主商量，而且房子可以长期出租,如果您想看这套房子只需提前10分钟跟我联系，我就能带您看房，期待您的来电！</p>', '坐南朝北', '31.540648', '6', '2', '1', '小鱼', '大兴附近地铁站', 'images/house/h901.jpg', 'images/house/h902.jpg', 'images/house/h903.jpg', 'images/house/h904.jpg', '2000', '100', '2016-05-11 17:58:43', '104.701711', '0', '18303091358', '海兴小区临海小屋', '1', null);
INSERT INTO `t_house` VALUES ('24', '1', 'images/house/h101.jpg', '采光好，设备齐全', null, null, null, null, '3', '1', '陈女士', '朝阳步行街', 'images/house/h101.jpg', 'images/house/h102.jpg', 'images/house/h103.jpg', 'images/house/h104.jpg', '1000', '100', '2016-05-17 00:00:00', null, '0', '111', '北京朝阳小区', '2', null);
INSERT INTO `t_house` VALUES ('25', '9', 'images/house/h101.jpg', '阳光明媚，家具齐全', '阳光明媚，家具齐全阳光明媚，家具齐全阳光明媚，家具齐全阳光明媚，家具齐全阳光明媚，家具齐全阳光明媚，家具齐全阳光明媚，家具齐全', '坐北朝南', null, '8', '2', '1', '陈柳羽', '天通苑北地铁站', 'images/house/h101.jpg', 'images/house/h102.jpg', 'images/house/h103.jpg', 'images/house/h104.jpg', '2000', '100', '2016-05-21 16:16:12', null, '2', '18303091358', '东三旗', '1', null);

-- ----------------------------
-- Table structure for `t_office`
-- ----------------------------
DROP TABLE IF EXISTS `t_office`;
CREATE TABLE `t_office` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` int(11) DEFAULT NULL,
  `basicImg` varchar(255) DEFAULT NULL,
  `basicInfo` varchar(255) DEFAULT NULL,
  `detailInfo` varchar(5000) DEFAULT NULL,
  `direction` varchar(255) DEFAULT NULL,
  `endPoint` double DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `linkMan` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `officeSource` int(11) DEFAULT NULL,
  `officeWay` int(11) DEFAULT NULL,
  `pic01` varchar(255) DEFAULT NULL,
  `pic02` varchar(255) DEFAULT NULL,
  `pic03` varchar(255) DEFAULT NULL,
  `pic04` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `proportation` int(11) DEFAULT NULL,
  `pubDate` datetime DEFAULT NULL,
  `startPoint` double DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `payWay_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK76AF90E7DB1250C2` (`payWay_id`),
  CONSTRAINT `FK76AF90E7DB1250C2` FOREIGN KEY (`payWay_id`) REFERENCES `t_payway` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_office
-- ----------------------------
INSERT INTO `t_office` VALUES ('4', '5', 'images/office/o101.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '5', '王兴青', '丰台 六里桥 ', '1', '1', 'images/office/o101.jpg', 'images/office/o102.jpg', 'images/office/o103.jpg', 'images/office/o104.jpg', '5000', '150', '2016-05-19 23:34:07', '104.701711', '2', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('5', '1', 'images/office/o201.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '5', '欧阳娜娜', '丰台 六里桥 ', '2', '2', 'images/office/o201.jpg', 'images/office/o203.jpg', 'images/office/o202.jpg', 'images/office/o204.jpg', '9000', '180', '2016-05-04 00:00:00', '104.701711', '2', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('6', '2', 'images/office/o301.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '2', '宋仲基', '丰台 六里桥 ', '1', '1', 'images/office/o301.jpg', 'images/office/o302.jpg', 'images/office/o303.jpg', 'images/office/o304.jpg', '7600', '200', '2016-05-13 23:34:18', '104.701711', '1', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('7', '1', 'images/office/o401.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '4', '陈柳玉', '丰台 六里桥 ', '1', '2', 'images/office/o401.jpg', 'images/office/o402.jpg', 'images/office/o403.jpg', 'images/office/o404.jpg', '9000', '210', '2016-05-05 23:34:25', '104.701711', '1', '18303091358', '律师事务所精装侨福芳草地', '2', null);
INSERT INTO `t_office` VALUES ('8', '3', 'images/office/o501.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '1', '白海子', '丰台 六里桥 ', '2', '2', 'images/office/o501.jpg', 'images/office/o502.jpg', 'images/office/o503.jpg', 'images/office/o504.jpg', '9000', '200', '2016-05-11 23:34:31', '104.701711', '1', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('9', '1', 'images/office/o401.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '3', '陈柳玉', '丰台 六里桥 ', '1', '1', 'images/office/o401.jpg', 'images/office/o405.jpg', 'images/office/o406.jpg', 'images/office/o407.jpg', '9000', '100', '2016-05-11 23:34:37', '104.701711', '1', '18303091358', '律师事务所精装侨福芳草地', '2', null);
INSERT INTO `t_office` VALUES ('10', '1', 'images/office/o101.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '7', '令狐冲', '丰台 六里桥 ', '2', '1', 'images/office/o101.jpg', 'images/office/o102.jpg', 'images/office/o103.jpg', 'images/office/o104.jpg', '6500', '200', '2016-05-12 23:34:43', '104.701711', '1', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('11', '4', 'images/office/o201.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '8', '陈柳玉', '丰台 六里桥 ', '2', '2', 'images/office/o201.jpg', 'images/office/o302.jpg', 'images/office/o303.jpg', 'images/office/o204.jpg', '4500', '150', '2016-05-16 23:34:49', '104.701711', '2', '18303091358', '律师事务所精装侨福芳草地', '2', null);
INSERT INTO `t_office` VALUES ('12', '1', 'images/office/o301.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '3', '纳兰容若', '丰台 六里桥 ', '1', '1', 'images/office/o101.jpg', 'images/office/o502.jpg', 'images/office/o403.jpg', 'images/office/o404.jpg', '8900', '300', '2016-05-09 23:34:55', '104.701711', '2', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('13', '8', 'images/office/o101.jpg', '写字楼全新装修！20平米，40平米，60平米，100平米多户型选择。', '悦都写字楼。六里桥西北角悦都大酒店院内，多种户型可灵活组合。优越地段、优惠价格3.8元／平米，精装修，四白落地，干净整洁，专用网络入户，毗邻京港澳高速，地铁9号，10号线交汇，多条公交线路到达，交通便利。\n写字楼位于：\n毗邻西三环，京石高速公路。交通:双地铁,30余条公交线路\n项目特色：25平米，50平米，80平米多户型选择，共1200多平米，已装修，室内采光好，办公环境优雅。\n办公环境：\n标准写字楼，采光通透，干净卫生，环境优美，户型丰富，一流管理服务，24小时电视监控。\n区位优势：\n多极商圈汇聚 金融街商圈+西客站-马连道商圈+六里桥-丽泽商圈+公主坟商圈等 足以体现您的：高、大、上！\n多维交通方式 北京西站+双地铁+京石高速公路+西三环……多线路网构建国家枢纽\n多维立体交通 西三环 / 地铁 / 铁路 / 长途汽车\n地铁9号线、10号线交汇；\n紧邻西三环，对望六里桥客运站，坐拥6小时动车经济圈。\n京石沿线，路面交通便捷', '朝南', '31.540648', '5', '唐七公子', '丰台 六里桥 ', '1', '1', 'images/office/o201.jpg', 'images/office/o102.jpg', 'images/office/o103.jpg', 'images/office/o104.jpg', '7600', '200', '2016-05-08 23:35:03', '104.701711', '0', '18303091358', '律师事务所精装侨福芳草地', '1', null);
INSERT INTO `t_office` VALUES ('14', '3', 'images/office/o201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '6', '陈柳羽', '六里桥西北角附近 或 悦都大酒店配楼', '2', '1', 'images/office/o101.jpg', 'images/office/o302.jpg', 'images/office/o403.jpg', 'images/office/o204.jpg', '6800', '102', '2016-05-11 11:22:24', '104.701711', '1', '18303091358', '六里桥悦都大酒店配楼', '2', null);
INSERT INTO `t_office` VALUES ('15', '5', 'images/office/o301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '4', '张三', '六里桥西北角附近 或 悦都大酒店配楼', '1', '2', 'images/office/o401.jpg', 'images/office/o102.jpg', 'images/office/o103.jpg', 'images/office/o104.jpg', '5800', '102', '2016-05-11 11:23:12', '104.701711', '1', '18303091358', '六里桥悦都大酒店配楼', '1', null);
INSERT INTO `t_office` VALUES ('16', '3', 'images/office/o101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '2', '陈柳羽', '六里桥西北角附近 或 悦都大酒店配楼', '2', '1', 'images/office/o401.jpg', 'images/office/o502.jpg', 'images/office/o503.jpg', 'images/office/o407.jpg', '5000', '111', '2016-05-11 11:23:12', '104.701711', '0', '18303091358', '六里桥悦都大酒店配楼', '1', null);
INSERT INTO `t_office` VALUES ('17', '6', 'images/office/o301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '4', '李四', '六里桥西北角附近 或 悦都大酒店配楼', '1', '2', 'images/office/o101.jpg', 'images/office/o102.jpg', 'images/office/o303.jpg', 'images/office/o104.jpg', '7600', '102', '2016-05-11 11:23:13', '104.701711', '1', '18303091358', '六里桥悦都大酒店配楼', '2', null);
INSERT INTO `t_office` VALUES ('18', '3', 'images/office/o101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '9', '陈柳羽', '六里桥西北角附近 或 悦都大酒店配楼', '2', '1', 'images/office/o501.jpg', 'images/office/o302.jpg', 'images/office/o103.jpg', 'images/office/o204.jpg', '6800', '210', '2016-05-11 11:23:13', '104.701711', '0', '18303091358', '六里桥悦都大酒店配楼', '1', null);
INSERT INTO `t_office` VALUES ('19', '10', 'images/office/o501.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '六里桥西北角附近 或 悦都大酒店配楼', '1', '2', 'images/office/o201.jpg', 'images/office/o502.jpg', 'images/office/o403.jpg', 'images/office/o104.jpg', '5689', '102', '2016-05-11 11:23:14', '104.701711', '0', '18303091358', '六里桥悦都大酒店配楼', '2', null);
INSERT INTO `t_office` VALUES ('20', '3', 'images/office/o101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '5', '陈柳羽', '六里桥西北角附近 或 悦都大酒店配楼', '2', '1', 'images/office/o101.jpg', 'images/office/o102.jpg', 'images/office/o103.jpg', 'images/office/o407.jpg', '5000', '160', '2016-05-11 11:23:14', '104.701711', '0', '18303091358', '六里桥悦都大酒店配楼', '1', null);

-- ----------------------------
-- Table structure for `t_payway`
-- ----------------------------
DROP TABLE IF EXISTS `t_payway`;
CREATE TABLE `t_payway` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_payway
-- ----------------------------

-- ----------------------------
-- Table structure for `t_store`
-- ----------------------------
DROP TABLE IF EXISTS `t_store`;
CREATE TABLE `t_store` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` int(11) DEFAULT NULL,
  `basicImg` varchar(255) DEFAULT NULL,
  `basicInfo` varchar(255) DEFAULT NULL,
  `classify` int(11) DEFAULT NULL,
  `detailInfo` varchar(5000) DEFAULT NULL,
  `direction` varchar(255) DEFAULT NULL,
  `endPoint` double DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `linkMan` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `pic01` varchar(255) DEFAULT NULL,
  `pic02` varchar(255) DEFAULT NULL,
  `pic03` varchar(255) DEFAULT NULL,
  `pic04` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `proportation` int(11) DEFAULT NULL,
  `pubDate` datetime DEFAULT NULL,
  `startPoint` double DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `storeSource` int(11) DEFAULT NULL,
  `supply` int(11) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `payWay_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKA0FA3556DB1250C2` (`payWay_id`),
  CONSTRAINT `FKA0FA3556DB1250C2` FOREIGN KEY (`payWay_id`) REFERENCES `t_payway` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_store
-- ----------------------------
INSERT INTO `t_store` VALUES ('2', '1', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '王青', '超清大悦城附近', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '8000', '450', '2016-05-09 08:54:33', '104.701711', '2', '1', '1', '18303091358', '朝青大悦城旁', '1', null);
INSERT INTO `t_store` VALUES ('3', '1', 'images/store/s201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '5', '王青', '超清大悦城附近', 'images/store/s201.jpg', 'images/store/s202.jpg', 'images/store/s203.jpg', 'images/store/s204.jpg', '8800', '400', '2016-06-03 08:52:28', '104.701711', '2', '1', '1', '18303091358', '朝青大悦城旁', '1', null);
INSERT INTO `t_store` VALUES ('4', '3', 'images/store/s301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '王青', '超清大悦城附近', 'images/store/s301.jpg', 'images/store/s302.jpg', 'images/store/s303.jpg', 'images/store/s304.jpg', '8900', '200', '2016-06-03 08:52:33', '104.701711', '2', '2', '2', '18303091358', '朝青大悦城旁', '1', null);
INSERT INTO `t_store` VALUES ('5', '1', 'images/store/s401.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '3', '王青', '超清大悦城附近', 'images/store/s401.jpg', 'images/store/s402.jpg', 'images/store/s403.jpg', 'images/store/s404.jpg', '5900', '300', '2016-04-28 08:52:37', '104.701711', '2', '1', '1', '18303091358', '朝青大悦城旁', '2', null);
INSERT INTO `t_store` VALUES ('6', '4', 'images/store/s501.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '王青', '超清大悦城附近', 'images/store/s501.jpg', 'images/store/s502.jpg', 'images/store/s503.jpg', 'images/store/s504.jpg', '4600', '400', '2016-05-17 08:52:42', '104.701711', '1', '2', '2', '18303091358', '朝青大悦城旁', '1', null);
INSERT INTO `t_store` VALUES ('7', '1', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '王青', '超清大悦城附近', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '6500', '430', '2016-05-13 08:52:48', '104.701711', '1', '1', '1', '18303091358', '朝青大悦城旁', '2', null);
INSERT INTO `t_store` VALUES ('8', '5', 'images/store/s201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '1', '王青', '超清大悦城附近', 'images/store/s201.jpg', 'images/store/s302.jpg', 'images/store/s203.jpg', 'images/store/s304.jpg', '8970', '400', '2016-05-13 08:52:53', '104.701711', '1', '2', '2', '18303091358', '朝青大悦城旁', '2', null);
INSERT INTO `t_store` VALUES ('9', '1', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '王青', '超清大悦城附近', 'images/store/s301.jpg', 'images/store/s402.jpg', 'images/store/s403.jpg', 'images/store/s504.jpg', '5066', '320', '2016-05-12 08:52:59', '104.701711', '1', '1', '1', '18303091358', '朝青大悦城旁', '2', null);
INSERT INTO `t_store` VALUES ('10', '2', 'images/store/s301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '5000', '231', '2016-05-16 08:53:03', '104.701711', '1', '2', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('11', '2', 'images/store/s401.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '2', '陈柳羽', '海淀黄庄步行街', 'images/store/s401.jpg', 'images/store/s402.jpg', 'images/store/s403.jpg', 'images/store/s304.jpg', '3040', '400', '2016-05-23 08:53:07', '104.701711', '1', '1', '1', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('12', '6', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s201.jpg', 'images/store/s302.jpg', 'images/store/s203.jpg', 'images/store/s304.jpg', '5690', '241', '2016-06-02 08:53:11', '104.701711', '1', '2', '2', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('13', '2', 'images/store/s201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '4', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '8000', '400', '2016-05-20 08:53:16', '104.701711', '1', '1', '1', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('14', '7', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '2', '陈柳羽', '海淀黄庄步行街', 'images/store/s501.jpg', 'images/store/s102.jpg', 'images/store/s503.jpg', 'images/store/s504.jpg', '8000', '244', '2016-05-03 08:53:20', '104.701711', '1', '2', '1', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('15', '2', 'images/store/s301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s401.jpg', 'images/store/s502.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '5600', '245', '2016-05-06 08:53:25', '104.701711', '1', '1', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('16', '8', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '4', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s302.jpg', 'images/store/s203.jpg', 'images/store/s304.jpg', '8000', '400', '2016-05-15 08:53:29', '104.701711', '0', '2', '1', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('17', '2', 'images/store/s501.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s201.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '6700', '533', '2016-05-12 08:53:33', '104.701711', '0', '1', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('18', '8', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '3', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s502.jpg', 'images/store/s403.jpg', 'images/store/s304.jpg', '8000', '400', '2016-05-06 08:53:38', '104.701711', '0', '2', '1', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('19', '9', 'images/store/s201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s304.jpg', '7600', '233', '2016-05-03 08:53:43', '104.701711', '0', '1', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('20', '2', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '5', '陈柳羽', '海淀黄庄步行街', 'images/store/s501.jpg', 'images/store/s302.jpgimages/store/s502.jpg', 'images/store/s503.jpg', 'images/store/s104.jpg', '8000', '400', '2016-05-10 08:53:47', '104.701711', '0', '2', '1', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('21', '10', 'images/store/s301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '6', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s502.jpg', 'images/store/s203.jpg', 'images/store/s504.jpg', '6700', '344', '2016-06-04 08:53:52', '104.701711', '0', '1', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('22', '2', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '7', '陈柳羽', '海淀黄庄步行街', 'images/store/s201.jpg', 'images/store/s102.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '8000', '400', '2016-05-04 08:53:57', '104.701711', '0', '2', '1', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('23', '3', 'images/store/s201.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '7', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s503.jpg', 'images/store/s304.jpg', '10000', '344', '2016-06-02 08:54:01', '104.701711', '0', '1', '2', '18303091358', '海淀黄庄商铺', '1', null);
INSERT INTO `t_store` VALUES ('24', '2', 'images/store/s301.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '2', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s401.jpg', 'images/store/s302.jpg', 'images/store/s103.jpg', 'images/store/s104.jpg', '9000', '400', '2016-05-05 08:54:06', '104.701711', '0', '2', '2', '18303091358', '海淀黄庄商铺', '2', null);
INSERT INTO `t_store` VALUES ('25', '2', 'images/store/s101.jpg', '位置好，社区成熟，环境安静，集中供暖，绿化面积大', '1', '位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大位置好，社区成熟，环境安静，集中供暖，绿化面积大', '坐北朝南', '31.540648', '10', '陈柳羽', '海淀黄庄步行街', 'images/store/s101.jpg', 'images/store/s102.jpg', 'images/store/s203.jpg', 'images/store/s104.jpg', '8000', '400', '2016-06-01 08:54:10', '104.701711', '0', '1', '1', '18303091358', '海淀黄庄商铺', '1', null);

-- ----------------------------
-- Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `birthDate` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `lastModifyTime` datetime DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `realname` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('1', '2015-03-02 08:53:11', '916356537@qq.com', '2016-05-03 08:53:52', '123', '小雨', '女', '18303091358', 'admin', null);
INSERT INTO `t_user` VALUES ('2', '2016-05-16 00:00:00', '333', '2016-05-14 09:20:43', '123', '柳儿', '男', '555', 'liu', null);
INSERT INTO `t_user` VALUES ('3', '2016-05-17 00:00:00', '916356538@qq.com', '2016-05-14 20:56:24', '123', 'liuyu', '男', '55556', 'wang', '小雨');
INSERT INTO `t_user` VALUES ('7', '2016-05-02 00:00:00', '12345', '2016-05-14 20:58:00', '123', 'liuer', '女', '22999', 'liuer', '小雨');
INSERT INTO `t_user` VALUES ('8', '2016-05-09 00:00:00', '916356537@qq.com', '2016-05-21 10:57:42', '123', '小晴', '男', '18303091358', 'Qing', '小雨');
INSERT INTO `t_user` VALUES ('9', '2016-04-01 00:00:00', '916356537@qq.com', '2016-06-07 11:18:52', '123', '丁嘉琪', '女', '18303091358', 'DJQ', '小雨');