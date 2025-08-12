// src/mock/data.js
import Mock from 'mockjs';

export default [
    {
        url: '/api/search',
        method: 'get',
        timeout: 1000,
        response: (req, res) => {
            // 提取搜索关键词
            const keyword = req.query.keyword || '';

            // 为不同关键词提供更相关的建议
            const keywordSpecificResults = {
                '沙拉': ['水果沙拉做法', '蔬菜沙拉搭配', '低卡沙拉酱推荐', '地中海沙拉食谱'],
                '鸡胸肉': ['鸡胸肉腌制方法', '低脂鸡胸肉做法', '鸡胸肉减肥食谱', '鸡胸肉怎么煮不柴'],
                '早餐': ['健康早餐食谱', '快速早餐做法', '减肥早餐推荐', '高蛋白早餐'],
                '汤': ['低卡汤品推荐', '快速汤食谱', '营养汤做法', '中式汤品大全'],
                '素食': ['素食蛋白质来源', '素食菜谱大全', '素食营养搭配', '简单素食做法'],
                '减肥': ['低卡食谱推荐', '减肥餐一周食谱', '减肥期间饮食搭配', '减肥可以吃的主食']
            };

            // 如果有关键词特定的结果，使用它们
            if (keywordSpecificResults[keyword]) {
                return {
                    code: 0,
                    data: keywordSpecificResults[keyword]
                };
            }

            // 否则生成随机数量的建议（3-8条）
            let num = Mock.mock('@integer(3,8)');
            let list = [];

            for (let i = 0; i < num; i++) {
                // 生成更符合食物主题的随机建议
                const randomData = Mock.mock({
                    title: '@ctitle(3, 8)'
                });

                // 50%概率在建议中包含关键词
                if (Math.random() > 0.5 && keyword) {
                    list.push(`${randomData.title}${keyword}`);
                } else {
                    // 生成更自然的食物相关建议
                    const foodSuggestions = [
                        '健康食谱',
                        '低卡做法',
                        '营养搭配',
                        '简单快手',
                        '减脂版',
                        '素食版',
                        '家常做法',
                        '创意吃法'
                    ];
                    const suffix = foodSuggestions[Math.floor(Math.random() * foodSuggestions.length)];
                    list.push(`${randomData.title}${suffix}`);
                }
            }

            return {
                code: 0,
                data: list
            };
        }
    },
    {
        url: '/api/hotlist',
        method: 'get',
        timeout: 1000,
        response: (req, res) => {
            return {
                code: 0,
                data: [
                    { id: '101', keyword: "低卡食谱", count: "1280万热度" },
                    { id: '102', keyword: "健身餐", count: "980万热度" },
                    { id: '103', keyword: "素食", count: "750万热度" },
                    { id: '104', keyword: "高蛋白早餐", count: "620万热度" },
                    { id: '105', keyword: "减脂汤", count: "580万热度" },
                    { id: '106', keyword: "鸡胸肉做法", count: "520万热度" },
                    { id: '107', keyword: "沙拉搭配", count: "480万热度" },
                    { id: '108', keyword: "低糖甜点", count: "430万热度" }
                ]
            };
        }
    },
    {
        url: '/api/home/tabs',
        method: 'get',
        timeout: 500,
        response: () => {
            return {
                code: 0,
                data: [
                    { id: '1', name: '今日推荐' },
                    { id: '2', name: '减肥餐' },
                    { id: '3', name: '早餐' },
                    { id: '4', name: '午餐' },
                    { id: '5', name: '晚餐' },
                    { id: '6', name: '甜点' }
                ]
            };
        }
    },

    {
        url: '/api/home/feed',
        method: 'get',
        timeout: 1000,
        response: (req) => {
            const tabId = req.query.tab || '1';
            const page = parseInt(req.query.page) || 1;
            const pageSize = 10;

            // 生成随机的帖子列表
            const count = Mock.mock('@integer(20, 30)'); // 总数据量
            const allItems = [];

            // 预先生成所有数据
            for (let i = 0; i < count; i++) {
                const imgHeight = Mock.mock('@integer(200, 400)');

                // 生成有效的图片URL - 这是关键修改
                const imageUrl = Mock.Random.image(`300x${imgHeight}`, Mock.Random.color(), '#fff', 'png');

                allItems.push({
                    id: Mock.mock('@id'),
                    title: Mock.mock('@ctitle(3, 8)'),
                    coverImg: imageUrl, // 使用生成的图片URL
                    author: Mock.mock('@cname'),
                    aspectRatio: `300/${imgHeight}`,
                    likes: Mock.mock('@integer(100, 1000)'),
                    comments: Mock.mock('@integer(0, 100)'),
                    description: Mock.mock('@csentence(10, 20)')
                });
      }

            // 分页处理
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const list = allItems.slice(start, end);
            const hasMore = end < allItems.length;

            return {
                code: 0,
                data: {
                    tabId,
                    list,
                    page,
                    pageSize,
                    total: allItems.length,
                    hasMore
                }
            };
        }
    }
];

