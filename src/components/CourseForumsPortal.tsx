import { useEffect, useState, FormEvent } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { PROGRAMS } from '../data/collegeData';
import type { ForumThread } from '../types/portal';

export function CourseForumsPortal() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [showNewForm, setShowNewForm] = useState(false);

  // New Thread Form
  const [newCourseCode, setNewCourseCode] = useState(PROGRAMS[0].code);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Student');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Reply state per thread
  const [activeReplyThreadId, setActiveReplyThreadId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const loadThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forums');
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const handleCreateThread = async (e: FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: newCourseCode,
          title: newTitle,
          author: newAuthor,
          authorRole: newRole,
          content: newContent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setThreads((prev) => [data.thread, ...prev]);
        setNewTitle('');
        setNewAuthor('');
        setNewContent('');
        setShowNewForm(false);
      }
    } finally {
      setPosting(false);
    }
  };

  const handlePostReply = async (threadId: string, e: FormEvent) => {
    e.preventDefault();
    if (!replyAuthor.trim() || !replyContent.trim()) return;
    const res = await fetch(`/api/forums/${threadId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: replyAuthor,
        role: 'Student',
        content: replyContent,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      setReplyAuthor('');
      setReplyContent('');
      setActiveReplyThreadId(null);
    }
  };

  const courseOptions = ['ALL', ...Array.from(new Set(threads.map((t) => t.courseCode)))];
  const visibleThreads =
    courseFilter === 'ALL' ? threads : threads.filter((t) => t.courseCode === courseFilter);

  return (
    <div className="space-y-10 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#78716C]">
            Peer &amp; Faculty Academic Exchange
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Course Forums
          </h1>
          <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
            Departmental discussion boards for syllabus guidance, computing cluster reservations, wet-lab protocols,
            and examination prep groups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showNewForm ? 'Close Composer' : 'Start Discussion'}
        </button>
      </div>

      {/* New Discussion Composer */}
      {showNewForm && (
        <form
          onSubmit={handleCreateThread}
          className="border border-[#D6CEBE] bg-[#F4F0E8] p-6 space-y-4"
        >
          <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
            Create New Academic Thread
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="forum-course" className="block text-xs font-medium text-[#44403C] mb-1">
                Course / Program
              </label>
              <select
                id="forum-course"
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              >
                {PROGRAMS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="forum-author" className="block text-xs font-medium text-[#44403C] mb-1">
                Your Name
              </label>
              <input
                id="forum-author"
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g., Gokulnath K (II B.Sc. CS)"
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              />
            </div>
            <div>
              <label htmlFor="forum-role" className="block text-xs font-medium text-[#44403C] mb-1">
                Role
              </label>
              <select
                id="forum-role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              >
                <option value="Student">Student</option>
                <option value="Postgraduate Scholar">Postgraduate Scholar</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="forum-title" className="block text-xs font-medium text-[#44403C] mb-1">
              Discussion Subject
            </label>
            <input
              id="forum-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Concise topic headline"
              className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
            />
          </div>

          <div>
            <label htmlFor="forum-body" className="block text-xs font-medium text-[#44403C] mb-1">
              Details / Question
            </label>
            <textarea
              id="forum-body"
              rows={3}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share notes, lab questions, or study-group details..."
              className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={posting}
            className="px-5 py-2 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded-md hover:bg-[#292524] cursor-pointer"
          >
            {posting ? 'Publishing...' : 'Publish Thread'}
          </button>
        </form>
      )}

      {/* Course Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {courseOptions.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCourseFilter(code)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              courseFilter === code
                ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
            }`}
          >
            {code === 'ALL' ? 'All Courses' : code}
          </button>
        ))}
      </div>

      {/* Threads List */}
      {loading ? (
        <p className="text-sm text-[#78716C]">Loading course discussions...</p>
      ) : (
        <div className="space-y-6">
          {visibleThreads.map((thread) => (
            <article key={thread.id} className="border border-[#E5DFD5] bg-[#FBF9F5] p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C]">
                <span className="font-mono font-medium text-[#1E3A8A]">{thread.courseCode}</span>
                <span aria-hidden="true">·</span>
                <span>{thread.courseName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{thread.createdAt}</span>
              </div>

              <h2 className="mt-2 font-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
                {thread.title}
              </h2>
              <p className="mt-1 text-xs text-[#57534E]">
                Posted by {thread.author} ({thread.authorRole})
              </p>
              <p className="mt-3 text-sm text-[#292524] leading-relaxed max-w-3xl">{thread.content}</p>

              {/* Replies */}
              {thread.replies.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E5DFD5] space-y-3">
                  {thread.replies.map((rep) => (
                    <div key={rep.id} className="bg-[#F4F0E8] p-3.5 text-sm">
                      <div className="flex items-center justify-between text-xs text-[#57534E]">
                        <span className="font-medium text-[#1C1917]">
                          {rep.author} · {rep.role}
                        </span>
                        <span className="font-mono">{rep.createdAt}</span>
                      </div>
                      <p className="mt-1.5 text-[#292524]">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#78716C]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveReplyThreadId(activeReplyThreadId === thread.id ? null : thread.id)
                  }
                  className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  {activeReplyThreadId === thread.id ? 'Cancel Reply' : 'Post Reply'}
                </button>
              </div>

              {activeReplyThreadId === thread.id && (
                <form
                  onSubmit={(e) => handlePostReply(thread.id, e)}
                  className="mt-4 pt-4 border-t border-[#E5DFD5] space-y-3"
                >
                  <input
                    type="text"
                    required
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    placeholder="Your Name & Class (e.g., Meera K · I M.Sc. DS)"
                    className="w-full px-3 py-2 text-sm bg-[#F4F0E8] border border-[#D6CEBE] rounded-md"
                  />
                  <textarea
                    rows={2}
                    required
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your academic response..."
                    className="w-full px-3 py-2 text-sm bg-[#F4F0E8] border border-[#D6CEBE] rounded-md"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#1E3A8A] text-[#FBF9F5] rounded-md cursor-pointer"
                  >
                    Submit Reply
                  </button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
