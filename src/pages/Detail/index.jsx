// src/pages/Detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Toast } from 'react-vant';
import Mock from 'mockjs';
import useTitle from '@/hooks/useTitle';
import styles from './detail.module.css';

const Detail = () => {
  useTitle('食谱详情');
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  // 模拟获取详情数据
  useEffect(() => {
    const fetchRecipeDetail = () => {
      setLoading(true);

      // 模拟网络延迟
      setTimeout(() => {
        // 生成随机食谱数据
        const data = Mock.mock({
          id: '@id',
          title: '@ctitle(8, 16)',
          coverImg: Mock.Random.image('800x450', '#7CFC00', '#fff', 'png', '健康食谱'),
          author: '@cname',
          likes: '@integer(100, 1000)',
          comments: '@integer(0, 100)',
          description: '@cparagraph(3, 5)',
          prepTime: '@integer(5, 20)',
          cookTime: '@integer(15, 60)',
          servings: '@integer(1, 8)',
          difficulty: '@pick(["简单", "中等", "困难"])',
          ingredients: [
            { name: '@cword(2,5)', amount: '@integer(1,3)@pick(["个", "克", "汤匙", "茶匙"])', essential: true },
            { name: '@cword(2,5)', amount: '@integer(1,3)@pick(["个", "克", "汤匙", "茶匙"])', essential: true },
            { name: '@cword(2,5)', amount: '@integer(1,3)@pick(["个", "克", "汤匙", "茶匙"])', essential: true },
            { name: '@cword(2,5)', amount: '@integer(1,3)@pick(["个", "克", "汤匙", "茶匙"])', essential: false },
            { name: '@cword(2,5)', amount: '@integer(1,3)@pick(["个", "克", "汤匙", "茶匙"])', essential: false },
          ],
          steps: [
            { id: 1, description: '@cparagraph(1, 2)', image: Mock.Random.image('400x300', '#7CFC00', '#fff', 'png', '步骤1') },
            { id: 2, description: '@cparagraph(1, 2)', image: Mock.Random.image('400x300', '#7CFC00', '#fff', 'png', '步骤2') },
            { id: 3, description: '@cparagraph(1, 2)', image: Mock.Random.image('400x300', '#7CFC00', '#fff', 'png', '步骤3') },
            { id: 4, description: '@cparagraph(1, 2)', image: Mock.Random.image('400x300', '#7CFC00', '#fff', 'png', '步骤4') },
          ],
          nutrition: {
            calories: '@integer(200, 500)',
            protein: '@integer(5, 30)',
            carbs: '@integer(10, 60)',
            fat: '@integer(1, 20)',
            fiber: '@integer(2, 15)',
          },
          tags: ['健康', '低脂', '高蛋白', '@pick(["早餐", "午餐", "晚餐"])', '@pick(["素食", "荤食"])'],
        });

        setRecipe(data);
        setLoading(false);
      }, 800);
    };

    fetchRecipeDetail();
  }, [id]);

  // 切换收藏状态
  const toggleCollect = () => {
    setRecipe(prev => ({
      ...prev,
      collected: !prev.collected
    }));
  };

  // 切换步骤完成状态
  const toggleStepCompletion = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    } else {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  // 开始烹饪
  const startCooking = () => {
    navigate('/');
    Toast.success('开始烹饪！祝您烹饪愉快！');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.skeletonCover}></div>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonMeta}></div>
        <div className={styles.skeletonDescription}></div>
        <div className={styles.skeletonSection}></div>
        <div className={styles.skeletonList}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonListItem}>
              <div className={styles.skeletonCheckbox}></div>
              <div className={styles.skeletonText}></div>
            </div>
          ))}
        </div>
        <div className={styles.skeletonSection}></div>
        <div className={styles.skeletonGrid}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonGridItem}></div>
          ))}
        </div>
      </div>
    );
  }

  // 计算完成百分比
  const completionPercentage = recipe.steps.length > 0
    ? Math.round((completedSteps.length / recipe.steps.length) * 100)
    : 0;

  return (
    <div className={styles.container}>
      {/* 顶部封面图 */}
      <div className={styles.coverContainer}>
        <img
          src={recipe.coverImg}
          alt={recipe.title}
          className={styles.coverImage}
        />
        <div className={styles.headerActions}>
          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            &lt;
          </button>
          <button
            className={`${styles.actionButton} ${recipe.collected ? styles.collected : ''}`}
            onClick={toggleCollect}
          >
            {recipe.collected ? '已收藏' : '收藏'}
          </button>
        </div>
      </div>

      {/* 食谱基本信息 */}
      <div className={styles.recipeInfo}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.author}>
          <span className={styles.authorName}>作者: {recipe.author}</span>
          <div className={styles.meta}>
            <span>❤️ {recipe.likes}</span>
            <span>💬 {recipe.comments}</span>
          </div>
        </div>

        <div className={styles.description}>{recipe.description}</div>

        <div className={styles.tags}>
          {recipe.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{recipe.prepTime}分钟</div>
            <div className={styles.statLabel}>准备时间</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{recipe.cookTime}分钟</div>
            <div className={styles.statLabel}>烹饪时间</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{recipe.servings}人份</div>
            <div className={styles.statLabel}>份量</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{recipe.difficulty}</div>
            <div className={styles.statLabel}>难度</div>
          </div>
        </div>
      </div>

      {/* 食材部分 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>食材清单</h2>
        <div className={styles.ingredients}>
          <div className={styles.essentialIngredients}>
            <h3>主要食材</h3>
            <ul>
              {recipe.ingredients
                .filter(ing => ing.essential)
                .map((ingredient, index) => (
                  <li key={index}>
                    <span className={styles.ingredientName}>{ingredient.name}</span>
                    <span className={styles.ingredientAmount}>{ingredient.amount}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className={styles.optionalIngredients}>
            <h3>可选食材</h3>
            <ul>
              {recipe.ingredients
                .filter(ing => !ing.essential)
                .map((ingredient, index) => (
                  <li key={index}>
                    <span className={styles.ingredientName}>{ingredient.name}</span>
                    <span className={styles.ingredientAmount}>{ingredient.amount}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 步骤部分 */}
      <div className={styles.section}>
        <div className={styles.stepsHeader}>
          <h2 className={styles.sectionTitle}>烹饪步骤</h2>
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span>{completionPercentage}% 完成</span>
          </div>
        </div>

        <div className={styles.steps}>
          {recipe.steps.map((step) => (
            <div
              key={step.id}
              className={`${styles.step} ${completedSteps.includes(step.id) ? styles.completed : ''}`}
            >
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>步骤 {step.id}</span>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={completedSteps.includes(step.id)}
                    onChange={() => toggleStepCompletion(step.id)}
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.completeText}>
                    {completedSteps.includes(step.id) ? '已完成' : '标记完成'}
                  </span>
                </label>
              </div>

              <div className={styles.stepContent}>
                <div className={styles.stepDescription}>{step.description}</div>
                <img
                  src={step.image}
                  alt={`步骤 ${step.id}`}
                  className={styles.stepImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 营养成分 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>营养成分</h2>
        <div className={styles.nutritionGrid}>
          <div className={styles.nutritionItem}>
            <div className={styles.nutritionValue}>{recipe.nutrition.calories}</div>
            <div className={styles.nutritionLabel}>卡路里</div>
          </div>
          <div className={styles.nutritionItem}>
            <div className={styles.nutritionValue}>{recipe.nutrition.protein}g</div>
            <div className={styles.nutritionLabel}>蛋白质</div>
          </div>
          <div className={styles.nutritionItem}>
            <div className={styles.nutritionValue}>{recipe.nutrition.carbs}g</div>
            <div className={styles.nutritionLabel}>碳水化合物</div>
          </div>
          <div className={styles.nutritionItem}>
            <div className={styles.nutritionValue}>{recipe.nutrition.fat}g</div>
            <div className={styles.nutritionLabel}>脂肪</div>
          </div>
          <div className={styles.nutritionItem}>
            <div className={styles.nutritionValue}>{recipe.nutrition.fiber}g</div>
            <div className={styles.nutritionLabel}>膳食纤维</div>
          </div>
        </div>

        <div className={styles.healthTip}>
          <div className={styles.tipIcon}>💚</div>
          <div className={styles.tipContent}>
            <h3>健康小贴士</h3>
            <p>这道菜富含蛋白质和膳食纤维，脂肪含量低，是健康饮食的好选择。建议搭配新鲜蔬菜沙拉食用。</p>
          </div>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className={styles.footer}>
        <Button
          type="primary"
          size="large"
          block
          round
          className={styles.startButton}
          onClick={startCooking}
        >
          开始烹饪
        </Button>
      </div>
    </div>
  );
};

export default Detail;