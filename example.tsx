/**
 * 使用示例 - 仅供参考，实际使用时需要 Lynx 环境
 */

import { PullRefreshList } from './index';

// 示例数据类型
interface ItemData {
  id: number;
  title: string;
  content: string;
}

// 模拟数据
const mockData: ItemData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `项目 ${i + 1}`,
  content: `这是第 ${i + 1} 个项目的内容`,
}));

// 使用示例
export function Example() {
  const handleRefresh = async () => {
    console.log('刷新数据...');
    // 模拟异步刷新
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('刷新完成');
  };

  const handleLoadMore = () => {
    console.log('加载更多数据...');
  };

  return (
    <PullRefreshList<ItemData>
      data={mockData}
      renderItem={(item) => (
        <view style={{ padding: '10px', backgroundColor: '#fff', marginBottom: '8px' }}>
          <text>{item.title}</text>
          <text>{item.content}</text>
        </view>
      )}
      keyExtractor={(item) => item.id}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      hasMoreData={true}
      listType="single"
    />
  );
}
