import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
  const { userInfo, supabase } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLawsIndex, setSelectedLawsIndex] = useState(null);

  // Fetch questions and answers from Supabase
  const fetchQuestionsAndAnswers = async () => {
    if (!userInfo) return;

    try {
      setLoading(true);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id, created_at, message')
        .eq('user', userInfo.id)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;

      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('message, relevant_laws, created_at')
        .eq('user', userInfo.id)
        .order('created_at', { ascending: false });

      if (answersError) throw answersError;

      const formattedData = questionsData.map((question, index) => {
        const answer = answersData[index] || null; 
        return {
          question: question.message,
          answer: answer?.message || 'Chưa có câu trả lời',
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

  useEffect(() => {
    fetchQuestionsAndAnswers();
  }, [userInfo]);

  // Handle submit new question
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

      await fetchQuestionsAndAnswers();
      setNewQuestion('');
    } catch (error) {
      console.error('Error posting question:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle relevant laws popup
  const toggleRelevantLaws = (index) => {
    setSelectedLawsIndex(selectedLawsIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-800 mb-3 md:text-4xl">
            Hỏi đáp pháp luật
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hệ thống trợ lý pháp luật dân sự thông minh, giúp bạn tìm hiểu các vấn đề pháp lý một cách dễ dàng
          </p>
        </div>

        {/* Question Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 transform transition-all duration-300 hover:shadow-xl border border-indigo-100">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn về pháp luật dân sự..."
                  className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newQuestion && (
                  <button
                    type="button"
                    onClick={() => setNewQuestion('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !newQuestion.trim()}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 disabled:opacity-50 shadow-md flex items-center justify-center whitespace-nowrap font-medium"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Gửi câu hỏi</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Questions and Answers List */}
        {loading && questions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow p-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Chưa có câu hỏi nào</h3>
            <p className="text-gray-600">Hãy đặt câu hỏi đầu tiên của bạn để bắt đầu cuộc trò chuyện</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-indigo-500"
              >
                {/* Question */}
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Câu hỏi:
                    </h3>
                    <p className="text-gray-700 mt-1">{item.question}</p>
                  </div>
                </div>
                
                {/* Answer */}
                <div className="flex items-start pl-10 mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Trả lời:
                    </h3>
                    <p className="text-gray-700 mt-1 whitespace-pre-line">{item.answer}</p>
                  </div>
                </div>
                
                {/* Relevant Laws */}
                {item.relevant_laws && item.relevant_laws.length > 0 && (
                  <div className="mt-4 pl-10">
                    <button
                      onClick={() => toggleRelevantLaws(index)}
                      className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>{selectedLawsIndex === index ? 'Ẩn điều luật liên quan' : 'Xem điều luật liên quan'}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${selectedLawsIndex === index ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {selectedLawsIndex === index && (
                      <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Điều luật liên quan:</h4>
                        <ul className="space-y-3">
                          {item.relevant_laws.map((law, lawIndex) => (
                            <li key={lawIndex} className="text-gray-600 text-sm bg-white p-3 rounded-md border-l-2 border-indigo-400">
                              <span className="font-medium text-indigo-700">{law.article}:</span>{' '}
                              {law.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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