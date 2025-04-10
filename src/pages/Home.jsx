import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
  const { userInfo, supabase } = useAuthStore();
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi và trả lời
  const [newQuestion, setNewQuestion] = useState(''); // Giá trị input của form
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Lấy danh sách câu hỏi và trả lời từ Supabase
  const fetchQuestionsAndAnswers = async () => {
    if (!userInfo) return;

    console.log(userInfo.id);

    try {
      setLoading(true);

      // Lấy danh sách câu hỏi
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id, created_at, message')
        .eq('user', userInfo.id)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;

      // Lấy danh sách câu trả lời
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('message, relevant_laws, created_at')
        .eq('user', userInfo.id)
        .order('created_at', { ascending: false });

      if (answersError) throw answersError;

      // Kết hợp dữ liệu (giả sử câu hỏi và câu trả lời tương ứng theo thứ tự created_at)
      const formattedData = questionsData.map((question, index) => {
        const answer = answersData[index] || null; // Lấy câu trả lời tương ứng (nếu có)
        return {
          question: question.message,
          answer: answer?.message|| 'Chưa có câu trả lời',
          relevant_laws: answer?.relevant_laws || [],
        };
      });

      setQuestions(formattedData);
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc userInfo thay đổi
  useEffect(() => {
    fetchQuestionsAndAnswers();
  }, [userInfo]);

  // Xử lý gửi câu hỏi mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('No access token found');

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newQuestion }),
      });

      if (!response.ok) throw new Error('Failed to post question');

      // Sau khi gửi thành công, làm mới danh sách từ Supabase
      await fetchQuestionsAndAnswers();
      setNewQuestion(''); // Reset form
    } catch (error) {
      console.error('Error posting question:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Hỏi đáp pháp luật
        </h1>

        {/* Form gửi câu hỏi */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 shadow-md"
            >
              {loading ? 'Đang gửi...' : 'Gửi câu hỏi'}
            </button>
          </div>
        </form>

        {/* Danh sách câu hỏi và trả lời */}
        {loading && questions.length === 0 ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500">Bạn chưa có câu hỏi nào.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                {/* Câu hỏi */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Q: {item.question}
                </h2>
                {/* Câu trả lời */}
                <p className="text-gray-700 mb-4">A: {item.answer}</p>
                {/* Luật liên quan */}
                {item.relevant_laws && item.relevant_laws.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Luật liên quan:
                    </h3>
                    <ul className="space-y-2">
                      {item.relevant_laws.map((law, lawIndex) => (
                        <li
                          key={lawIndex}
                          className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md"
                        >
                          <span className="font-medium">{law.article}:</span>{' '}
                          {law.content} (Độ tương đồng: {law.similarity_score})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;