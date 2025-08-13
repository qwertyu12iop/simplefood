import useTitle from '@/hooks/useTitle'
import { useState, useRef, startTransition } from 'react';
import {
  Image, Cell, CellGroup, ActionSheet, Dialog, Toast,
  Grid, GridItem, Tag, Button, Card, Loading, Field
} from 'react-vant'
import {
  ServiceO, StarO, SettingO, BookmarkO,
  GiftO, ChatO, FireO, Search, Edit, DiamondO
} from '@react-vant/icons'
import { useNavigate } from 'react-router-dom'; // 引入路由导航钩子
import styles from './profile.module.css'

import avatarImage from '@/assets/1.png';

const Profile = () => {
  useTitle("我的");
  const navigate = useNavigate(); // 获取导航函数

  // 创建文件输入框的引用
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newAvatarPreview, setNewAvatarPreview] = useState('');
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [userInfo, setUserInfo] = useState({
    nickname: '简小食',
    level: 'Lv3',
    slogan: '健康生活，从简食开始',
    avatar: "https://c-ssl.duitang.com/uploads/blog/202307/17/YxSX3XQ2uqy63DD.jpg",
    points: 1280
  });

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tempNickname, setTempNickname] = useState(userInfo.nickname);
  const [tempSlogan, setTempSlogan] = useState(userInfo.slogan);

  // 模拟上传头像的API
  const uploadAvatarApi = (file) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({ avatarUrl: event.target.result });
        };
        reader.readAsDataURL(file);
      }, 1500);
    });
  };

  // 只保留上传头像选项
  const actions = [
    { name: '上传头像', color: '#07c160', type: 2 }
  ];

  // 处理头像操作 - 使用 startTransition
  const handleAction = (e) => {
    setShowActionSheet(false);
    if (e.type === 2) {
      startTransition(() => {
        fileInputRef.current?.click();
      });
    }
  };

  // 处理文件选择和预览 - 使用 startTransition
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Toast.fail('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Toast.fail('图片大小不能超过5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      startTransition(() => {
        setNewAvatarPreview(event.target.result);
        setShowAvatarPreview(true);
      });
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  // 确认更新头像 - 使用 startTransition
  const confirmAvatarUpdate = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const result = await uploadAvatarApi(selectedFile);

      startTransition(() => {
        setUserInfo(prev => ({
          ...prev,
          avatar: result.avatarUrl
        }));
      });

      Toast.success('操作成功');
    } catch (error) {
      Toast.fail('上传失败');
      console.error('上传失败:', error);
    } finally {
      startTransition(() => {
        setIsUploading(false);
        setShowAvatarPreview(false);
        setNewAvatarPreview('');
        setSelectedFile(null);
      });
    }
  };

  // 取消头像更新
  const cancelAvatarUpdate = () => {
    startTransition(() => {
      setShowAvatarPreview(false);
      setNewAvatarPreview('');
      setSelectedFile(null);
    });
  };

  const openEditDialog = () => {
    startTransition(() => {
      setTempNickname(userInfo.nickname);
      setTempSlogan(userInfo.slogan);
      setShowEditDialog(true);
    });
  };

  const saveUserInfo = () => {
    if (!tempNickname.trim()) {
      // Toast.fail('不能为空');
      console.log('不能为空');
      return;
    }

    startTransition(() => {
      setUserInfo(prev => ({
        ...prev,
        nickname: tempNickname,
        slogan: tempSlogan
      }));
      setShowEditDialog(false);
    });

    // Toast.success('操作成功');
    console.log('操作成功');

    
  };

  // 修改gridData添加路由跳转功能
  const gridData = [
    {
      icon: <GiftO style={{ color: '#07c160' }} />,
      text: '创意厨房',
      onClick: () => navigate('/post')
    },
    {
      icon: <ChatO style={{ color: '#07c160' }} />,
      text: '智能聊天',
      onClick: () => navigate('/chat'),
      badge: 3
    },
    {
      icon: <BookmarkO style={{ color: '#07c160' }} />,
      text: '收藏',
      onClick: () => navigate('/favorites'),
      badge: 8
    },
    {
      icon: <FireO style={{ color: '#07c160' }} />,
      text: '热门',
      onClick: () => navigate('/home')
    },
  ];

  // 添加菜单项的路由跳转
  const menuItems = [
    {
      title: "我的服务",
      icon: <ServiceO color="#07c160" />,
      onClick: () => navigate('/services')
    },
    {
      title: "我的收藏",
      icon: <StarO color="#07c160" />,
      onClick: () => navigate('/favorites'),
      rightText: "32"
    },
    {
      title: "系统设置",
      icon: <SettingO color="#07c160" />,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Dialog
        visible={showAvatarPreview}
        title="预览头像"
        showCancelButton
        confirmText="确认使用"
        cancelText="重新选择"
        onConfirm={confirmAvatarUpdate}
        onCancel={cancelAvatarUpdate}
        confirmLoading={isUploading}
      >
        <div className={styles.avatarPreviewContainer}>
          {isUploading ? (
            <div className={styles.uploadingContainer}>
              <Loading size="24" color="#07c160" />
              <p className={styles.uploadingText}>正在上传...</p>
            </div>
          ) : (
            <Image
              round
              src={newAvatarPreview}
              className={styles.previewAvatar}
              alt="头像预览"
            />
          )}
        </div>
      </Dialog>

      <Card round className={styles.userCard}>
        <div className={styles.userHeader}>
          <div
            className={styles.avatarContainer}
            onClick={() => setShowActionSheet(true)}
            role="button"
            aria-label="更换头像"
          >
            <Image
              round
              src={userInfo.avatar}
              className={styles.avatar}
              alt="用户头像"
            />
            <div className={styles.editBadge}>
              <Edit fontSize={14} color="#fff" />
            </div>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.nickname}>{userInfo.nickname}</h2>
              <Tag type="primary" color="#07c160" plain className={styles.levelTag}>
                <DiamondO fontSize={14} /> {userInfo.level}
              </Tag>
            </div>
            <p className={styles.slogan}>{userInfo.slogan}</p>
            <div className={styles.points}>
              简食积分: <span>{userInfo.points}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            round
            size="small"
            icon={<Edit />}
            onClick={openEditDialog}
            className={styles.editBtn}
            color="#07c160"
          >
            编辑资料
          </Button>
        </div>
      </Card>

      <Card round className={styles.gridCard}>
        <Grid border={false} columnNum={4}>
          {gridData.map((item, index) => (
            <GridItem
              key={index}
              icon={item.icon}
              text={item.text}
              badge={item.badge}
              className={styles.gridItem}
              onClick={item.onClick} // 使用路由跳转函数
            />
          ))}
        </Grid>
      </Card>

      <CellGroup inset className={styles.menuGroup}>
        {menuItems.map((item, index) => (
          <Cell
            key={index}
            title={item.title}
            icon={item.icon}
            isLink
            rightText={item.rightText}
            onClick={item.onClick} // 使用路由跳转函数
          />
        ))}
      </CellGroup>

      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        cancelText="取消"
        onCancel={() => setShowActionSheet(false)}
        onSelect={handleAction}
        description="选择头像更换方式"
      />

      <Dialog
        visible={showEditDialog}
        title="编辑资料"
        showCancelButton
        onConfirm={saveUserInfo}
        onCancel={() => setShowEditDialog(false)}
      >
        <div className={styles.dialogContent}>
          <Field
            label="昵称"
            value={tempNickname}
            onChange={setTempNickname}
            placeholder="请输入昵称"
            maxlength={12}
            className={styles.field}
          />
          <Field
            label="个性签名"
            value={tempSlogan}
            onChange={setTempSlogan}
            placeholder="分享你的健康理念"
            maxlength={30}
            className={styles.field}
            type="textarea"
            autosize
            rows={2}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
