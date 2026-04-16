/**
 * LOFTER 同人 IP/CP 知识库
 * 数据来源：2024-2025年 LOFTER CP排行榜（B站Francium统计）
 * 结构：IP → CP组合 → 人设标签 + 故事梗概 + 写作要点
 */

export interface CPPair {
  name: string;          // CP名称，如 "忘羡"
  chars: string;         // 角色名，如 "蓝忘机 × 魏無羨"
  tags: string[];        // 人设标签，如 ["雅正攻", "疯批受", "双强", "双向救赎"]
  summary: string;       // 爆款故事梗概
  writingTips: string[]; // 写作要点/热门元素
  heat: "🔥🔥🔥" | "🔥🔥" | "🔥"; // 热度等级
  updateTime: string;    // 最后更新时间
}

export interface IP {
  id: string;             // 唯一标识
  name: string;          // IP名称
  nameEn?: string;       // 英文名（如有）
  category: "anime" | "game" | "movie" | "novel" | "celebrity";
  source: string;        // 来源（原著/游戏/动画）
  logo?: string;         // 图标emoji
  topCPs: CPPair[];      // 热门CP列表
  hotTags: string[];     // 热门标签（用于LOFTER搜索）
  latestNews?: string;   // 2025年最新动态
}

export const IP_CP_DATABASE: IP[] = [
  {
    id: "guomanzhushizu",
    name: "魔道祖师",
    category: "anime",
    source: "墨香铜臭原著",
    logo: "⚔️",
    topCPs: [
      {
        name: "忘羡",
        chars: "蓝忘机 × 魏無羨",
        tags: ["雅正攻", "疯批受", "双强", "双向救赎", "前世今生"],
        summary: "前世魏無羨剖丹惨死，蓝忘机独守十三年；重生后联手揭阴谋，最终归隐。",
        writingTips: [
          "开局即重逢——十六年后的意外相认",
          "含光君的压抑宠溺 vs 夷陵老祖的撩人于无形",
          "追凌在旁边吐槽，忘羡在一边发糖",
          "打怪升级 + 感情递进双线并行",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["魔道祖师", "忘羡", "蓝忘机", "魏無羨", "墨香铜臭"],
    latestNews: "动漫第三季完结，长期保持LOFTER前三CP",
  },
  {
    id: "guimiezhixia",
    name: "鬼灭之刃",
    category: "anime",
    source: "吾峠呼世晴漫画/动画",
    logo: "🌊",
    topCPs: [
      {
        name: "锖义",
        chars: "锖兔 × 富冈义勇",
        tags: ["温柔少年攻", "沉默受", "竹马", "意难平", "生死离别"],
        summary: "锖兔为救义勇断喉牺牲，义勇带着半片锖兔的羽织活下去，是「一半是你」的遗憾。",
        writingTips: [
          "开场即刀——开篇交代锖兔之死",
          "义勇的沉默寡言 vs 锖兔的温柔记忆",
          "蝴蝶屋复健时期的交集",
          "最终选拔的并肩作战（回忆杀）",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "炼蜜",
        chars: "炼狱杏寿郎 × 蜜璃",
        tags: ["热血攻", "可爱受", "阳光", "温馨", "柱合训练"],
        summary: "无限列车后再无交集，但在LOFTER上这对CP热度极高，是温暖治愈系首选。",
        writingTips: [
          "蜜璃相亲失败后遇到炼狱",
          "柱合训练时的互动",
          "各自的回忆杀（炼狱的过去/蜜璃的家乡）",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "义炼",
        chars: "富冈义勇 × 炼狱杏寿郎",
        tags: ["冷傲攻", "热血受", "柱同期", "惺惺相惜"],
        summary: "两位柱的惺惺相惜，义勇不擅长言辞，炼狱永远正向激励。",
        writingTips: [
          "柱会议上的眼神交流",
          "战斗中的配合",
          "各自的孤独与坚持",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["鬼灭之刃", "锖义", "炼蜜", "富冈义勇", "鬼杀队"],
    latestNews: "2024年新番播出，热度持续，锖义长期占据LOFTER前五",
  },
  {
    id: "feichirensheng",
    name: "飞驰人生",
    category: "movie",
    source: "韩寒电影",
    logo: "🏎️",
    topCPs: [
      {
        name: "驰强",
        chars: "张驰 × 孙宇强",
        tags: ["热血车手攻", "长发领航员受", "七年搭档", "追梦"],
        summary: "巴音布鲁克车神与他的领航员，落魄时互相扶持，重返赛场并肩冲刺。",
        writingTips: [
          "从巅峰跌落谷底",
          "一根筋的张驰 + 全程跟陪的宇强",
          "赛场上的默契配合",
          "「我懂你」的无声默契",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["飞驰人生", "驰强", "张驰", "孙宇强", "巴音布鲁克"],
    latestNews: "第二部2024春节档上映，成为LOFTER新晋顶流CP",
  },
  {
    id: "longzu",
    name: "龙族",
    category: "novel",
    source: "江南小说",
    logo: "🐉",
    topCPs: [
      {
        name: "泽非",
        chars: "路鸣泽 × 路明非",
        tags: ["魔鬼弟弟攻", "废柴哥哥受", "宿命共生", "黑王白王"],
        summary: "路鸣泽以生命为代价帮路明非实现愿望，两人是黑王与白王的转世。",
        writingTips: [
          "路鸣泽的真实身份",
          "每一次交易的代价",
          "哥哥的废物属性 vs 弟弟的强势宠溺",
          "结局刀的刀，糖的糖",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["龙族", "泽非", "路鸣泽", "路明非", "江南"],
    latestNews: "《龙族》动画化消息，CP热度回升",
  },
  {
    id: "siwangbiji",
    name: "死亡笔记",
    category: "anime",
    source: "大场鸫/小畑健漫画",
    logo: "📓",
    topCPs: [
      {
        name: "L月",
        chars: "L × 夜神月",
        tags: ["侦探攻", "天才受", "智斗宿敌", "相爱相杀", "猫鼠游戏"],
        summary: "世界第一侦探与捡到死亡笔记的高中生，展开极致智商博弈。",
        writingTips: [
          "开局即对决——L与月的第一次照面",
          "双方的心理战与试探",
          "弥海砂的三角关系",
          "结局的宿命对决",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["死亡笔记", "L月", "L", "夜神月", "智斗"],
    latestNews: "经典永不过时，智斗类CP常青树",
  },
  {
    id: "daomubiji",
    name: "盗墓笔记",
    category: "novel",
    source: "南派三叔小说",
    logo: "🗺️",
    topCPs: [
      {
        name: "瓶邪",
        chars: "张起灵 × 吴邪",
        tags: ["高冷神攻", "软萌受", "宿命羁绊", "铁三角"],
        summary: "吴邪追寻小哥足迹，小哥在他最危险时出现，跨越生死的百年守护。",
        writingTips: [
          "吴邪的「失踪」与小哥的出场",
          "铁三角下斗的日常",
          "小哥失忆时期的照顾",
          "「带我回家」的终极命题",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["盗墓笔记", "瓶邪", "张起灵", "吴邪", "铁三角"],
    latestNews: "短剧/动画持续产出，长期稳定LOFTER前五",
  },
  {
    id: "zhuintan",
    name: "名侦探柯南",
    category: "anime",
    source: "青山刚昌漫画",
    logo: "🔍",
    topCPs: [
      {
        name: "快新",
        chars: "黑羽快斗 × 工藤新一",
        tags: ["怪盗攻", "侦探受", "欢喜冤家", "势均力敌", "互相试探"],
        summary: "怪盗与侦探的猫鼠游戏，互相试探又彼此守护。",
        writingTips: [
          "基德的预告函 vs 新一的推理",
          "每次对决后的惺惺相惜",
          "秘密身份的心照不宣",
          "「月下的魔术师」与「沉睡的小五郎」",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "赤安",
        chars: "赤井秀一 × 安室透",
        tags: ["卧底攻", "公安受", "相爱相杀", "虐恋", "立场对立"],
        summary: "FBI与日本公安的对立与和解，彼此试探的虐心关系。",
        writingTips: [
          "「诸星大人」与「波本」的真实身份",
          "苏格兰之死的芥蒂",
          "拆弹篇的合作与信任建立",
          "秀透的暧昧张力",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["名侦探柯南", "快新", "赤安", "怪盗基德", "安室透"],
    latestNews: "M27《百万美元的五棱星》上映，CP热度创新高",
  },
  {
    id: "penghai",
    name: "崩铁·崩坏星穹铁道",
    category: "game",
    source: "米哈游游戏",
    logo: "🚂",
    topCPs: [
      {
        name: "星穹列车组",
        chars: "丹恒 × 饮月",
        tags: ["宿命", "前世", "龙师", "轮回"],
        summary: "饮月之乱的真相，丹恒作为饮月的转世背负前世罪孽。",
        writingTips: [
          "饮月的骄傲与丹恒的隐忍",
          "罗浮仙舟的过往",
          "「我究竟是谁」的identity crisis",
        ],
        heat: "🔥🔥",
        updateTime: "2025-03",
      },
    ],
    hotTags: ["崩坏星穹铁道", "饮月", "丹恒", "星穹列车", "米哈游"],
    latestNews: "2024年推出2.0版本，翡翠开拓新热度",
  },
  {
    id: "genshin",
    name: "原神",
    category: "game",
    source: "米哈游游戏",
    logo: "🌟",
    topCPs: [
      {
        name: "魈荧",
        chars: "魈 × 旅行者（荧）",
        tags: ["高冷守护攻", "旅行者是", "救赎", "契约"],
        summary: "降魔大圣与旅行者的守护契约，漫长岁月中唯一的温度。",
        writingTips: [
          "海灯节的约定",
          "旅行者带来的改变",
          "「契约」与「守护」的冲突",
          "梦境的交织",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-03",
      },
      {
        name: "公钟",
        chars: "钟离 × 达达利亚",
        tags: ["契约之神攻", "至冬执行官受", "势均力敌", "公款恋爱"],
        summary: "岩王帝君与愚人众执行官的契约式调情，CP界的常青树。",
        writingTips: [
          "达达利亚的「挑战」与钟离的从容",
          "「我全都要」的达达利亚式追求",
          "关于账单的各种梗",
          "传说任务的交集",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-03",
      },
    ],
    hotTags: ["原神", "魈荧", "公钟", "魈", "钟离", "达达利亚"],
    latestNews: "2025年5.0纳塔版本，新角色持续拉动CP热度",
  },
  {
    id: "zhoushuixc",
    name: "咒术回战",
    category: "anime",
    source: "芥见下々漫画/动画",
    logo: "👊",
    topCPs: [
      {
        name: "五悠",
        chars: "五条件 × 虎杖悠仁",
        tags: ["导师攻", "阳光受", "救赎", "成长"],
        summary: "五条件作为导师对虎杖的救贖与羁绊，宿命感拉满。",
        writingTips: [
          "五条件的「轻小说」日常",
          "虎杖的善良与纯粹",
          "宿傩与虎杖的灵魂共存",
          "怀玉·玉折虐线",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "夏油",
        chars: "夏油杰 × 悟",
        tags: ["挚友", "理念对立", "BE", "最残念的两人"],
        summary: "最佳挚友走向对立，夏油叛逃后的正反对决。",
        writingTips: [
          "高专时期的回忆",
          "「叛徒」与「最强」的碰撞",
          "怀玉篇的虐",
          "新漫画的刀",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["咒术回战", "五悠", "夏油杰", "五条件", "虎杖悠仁"],
    latestNews: "漫画最终章播出，苼了野蔷薇CP争议，CP排行稳定",
  },
  {
    id: "zetsuboutachi",
    name: "蓝色监狱",
    category: "anime",
    source: "手游屋优翔太漫画",
    logo: "⚽",
    topCPs: [
      {
        name: "洁蜂",
        chars: "洁世一 × 蜂乐回",
        tags: ["核心搭档", "天才", "进攻意识", "足球"],
        summary: "蓝色监狱最吸睛的进攻组合，洁与蜂乐的默契配合。",
        writingTips: [
          "第一次碰面时的火花",
          "「我要成为日本第一的前锋」的共鸣",
          "比赛中的配合",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["蓝色监狱", "洁蜂", "洁世一", "蜂乐回", "BLUE LOCK"],
    latestNews: "第三季2024播出，热度上升",
  },
  {
    id: "chiikawa",
    name: "Chiikawa",
    category: "anime",
    source: "はまじあき漫画/动画",
    logo: "🐱",
    topCPs: [
      {
        name: "小可爱们",
        chars: "小可爱 × 小兔子 × 小三角",
        tags: ["治愈", "友情", "日常", "萌系"],
        summary: "三位小可爱在吉托托山的日常，温暖治愈的每一帧。",
        writingTips: [
          "每个角色的独特性格（认真/冲动/温柔）",
          "可爱的日常互动",
          "偶尔的刀子（但很快被治愈）",
        ],
        heat: "🔥🔥",
        updateTime: "2025-03",
      },
    ],
    hotTags: ["chiikawa", "小可爱", "吉托托山", "chiikawa中文"],
    latestNews: "2024年动画化后迅速走红，2025年持续高热",
  },
  {
    id: "fatezhongshen",
    name: "Fate/Zero",
    category: "anime",
    source: "虚渊玄小说/动画",
    logo: "⚜️",
    topCPs: [
      {
        name: "金樱",
        chars: "吉尔伽美什 × 阿尔托莉雅",
        tags: ["古王攻", "呆萌受", "王の傲娇", "宿敌"],
        summary: "英雄王与不列颠王的跨时代碰撞，最强Saber与最古之王的对决。",
        writingTips: [
          "金皮卡的「杂修」名台词",
          "呆毛王的认真与正直",
          "UBW线的经典对决",
          "王的傲慢与孤独",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "言切",
        chars: "言峰绮礼 × 卫宫切嗣",
        tags: ["神父攻", "杀手受", "理念对决", "悲剧"],
        summary: "第四次圣杯战争的核心对立，理念与手段的终极碰撞。",
        writingTips: [
          "各自的正义观",
          "第四次圣杯战争的关键事件",
          "最后十分钟的生死对决",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["Fate", "金樱", "言切", "吉尔伽美什", "阿尔托莉雅"],
    latestNews: "FGO持续联动，老番新热度",
  },
  {
    id: "ao3hot",
    name: "AO3热门同人",
    category: "novel",
    source: "AO3 Archive",
    logo: "📚",
    topCPs: [
      {
        name: "史传奇",
        chars: "Stephen Strange × Tony Stark",
        tags: ["科学家攻", "天才受", "漫威", "复仇者"],
        summary: "漫威双魔法天才的合作与互相拯救，复联内战的遗憾延续。",
        writingTips: [
          "时间宝石的代价",
          "泰坦星之战的重逢",
          "博士的梦预言与托尼斯塔克的终局",
          "多元宇宙的再次交汇",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["MCU", "史传奇", "奇异铁", "漫威同人", "AO3"],
    latestNews: "复联5/6消息+多部MCU新片，漫威CP持续高热",
  },
  {
    id: "hp",
    name: "哈利·波特",
    category: "novel",
    source: "J.K.罗琳原著",
    logo: "⚡",
    topCPs: [
      {
        name: "德哈",
        chars: "德拉科·马尔福 × 哈利·波特",
        tags: ["校园宿敌", "傲娇攻", "互相拉扯", "欲盖弥彰"],
        summary: "霍格沃茨最经典的「冤家」CP，从对抗到理解的漫长拉锯。",
        writingTips: [
          "狭路相逢的走廊",
          "O.W.L考试期间的合作",
          "第六部的若有似无",
          "死亡圣器的生死相依",
        ],
        heat: "🔥🔥🔥",
        updateTime: "2025-01",
      },
      {
        name: "犬狼",
        chars: "詹姆·波特 × 小天狼星·布莱克",
        tags: ["竹马", "生死之交", "BE", "意难平"],
        summary: "掠夺者时代的友情岁月，最终布莱克监狱逃亡与波特家的悲剧。",
        writingTips: [
          "霍格沃茨的友谊岁月",
          "掠夺者的秘密",
          "布莱克逃跑的计划",
          "尖叫棚屋的真相",
        ],
        heat: "🔥🔥",
        updateTime: "2025-01",
      },
    ],
    hotTags: ["哈利波特", "德哈", "犬狼", "德拉科", "HP"],
    latestNews: "HBO翻拍剧集，带动原作CP热度回升",
  },
];

/**
 * 获取所有热门IP（按热度排序）
 */
export function getHotIPs(): IP[] {
  return IP_CP_DATABASE.filter(ip => 
    ip.topCPs.some(cp => cp.heat === "🔥🔥🔥")
  ).sort((a, b) => {
    const aMax = a.topCPs.filter(cp => cp.heat === "🔥🔥🔥").length;
    const bMax = b.topCPs.filter(cp => cp.heat === "🔥🔥🔥").length;
    return bMax - aMax;
  });
}

/**
 * 根据类别获取IP
 */
export function getIPsByCategory(category: IP["category"]): IP[] {
  return IP_CP_DATABASE.filter(ip => ip.category === category);
}

/**
 * 搜索IP或CP
 */
export function searchIPCP(query: string): Array<{type: "ip" | "cp"; ip: IP; cp?: CPPair; matchText: string}> {
  const q = query.toLowerCase();
  const results: Array<{type: "ip" | "cp"; ip: IP; cp?: CPPair; matchText: string}> = [];
  
  for (const ip of IP_CP_DATABASE) {
    if (ip.name.toLowerCase().includes(q) || 
        ip.nameEn?.toLowerCase().includes(q) ||
        ip.hotTags.some(t => t.toLowerCase().includes(q))) {
      results.push({ type: "ip", ip, matchText: ip.name });
    }
    for (const cp of ip.topCPs) {
      if (cp.name.toLowerCase().includes(q) ||
          cp.chars.toLowerCase().includes(q) ||
          cp.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({ type: "cp", ip, cp, matchText: `${ip.name} · ${cp.name}` });
      }
    }
  }
  return results;
}

/**
 * 获取随机高热CP（用于推荐）
 */
export function getRandomHotCP(): {ip: IP; cp: CPPair} {
  const hotIPs = getHotIPs();
  const ip = hotIPs[Math.floor(Math.random() * hotIPs.length)];
  const hotCPs = ip.topCPs.filter(cp => cp.heat === "🔥🔥🔥");
  const cp = hotCPs[Math.floor(Math.random() * hotCPs.length)] || ip.topCPs[0];
  return { ip, cp };
}
