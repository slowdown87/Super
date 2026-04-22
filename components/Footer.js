import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">智投学堂</h3>
            <p className="text-sm">
              帮助初学者学习投资知识，通过模拟交易实践投资策略，建立正确的投资理念。
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/courses" className="hover:text-white transition-colors">课程学习</a></li>
              <li><a href="/simulation" className="hover:text-white transition-colors">模拟交易</a></li>
              <li><a href="/portfolio" className="hover:text-white transition-colors">投资组合</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">免责声明</h3>
            <p className="text-sm">
              本平台仅供学习和模拟使用，不构成任何投资建议。投资有风险，入市需谨慎。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© 2024 智投学堂. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;