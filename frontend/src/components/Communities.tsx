import React, { useEffect, useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Clock, TrendingUp } from 'lucide-react';
import { api, Community, Post } from '../api';
import { PageHeader } from './ui/PageHeader';
import { Modal } from './ui/Modal';
import { FlaticonIcon } from './ui/FlaticonIcon';

// Flaticon PNGs (attribution in README → Icon Credits), tinted via CSS mask
const iconMap: Record<string, string> = {
  Compass: 'compass.png',
  Briefcase: 'briefcase.png',
  Coins: 'coins.png',
  HeartHandshake: 'handshake.png',
  Shield: 'shield.png',
  Moon: 'moon.png'
};

interface CommunitiesProps {
  username: string;
}

export const Communities: React.FC<CommunitiesProps> = ({ username }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New post modal state
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedProblemTag, setSelectedProblemTag] = useState('');

  // Active reply box
  const [replyOpenPostId, setReplyOpenPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      const comms = await api.getCommunities();
      setCommunities(comms);
      if (comms.length > 0 && !selectedCommunity) {
        setSelectedCommunity(comms[0]);
        loadPosts(comms[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (communityId: string) => {
    try {
      const p = await api.getPosts(communityId);
      setPosts(p);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectCommunity = (comm: Community) => {
    setSelectedCommunity(comm);
    loadPosts(comm.id);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity || !postTitle.trim() || !postContent.trim()) return;

    try {
      const newP = await api.createPost(selectedCommunity.id, {
        authorUsername: username,
        title: postTitle,
        content: postContent,
        problemTag: selectedProblemTag || selectedCommunity.frequentProblems[0]?.problem || 'General Discussion',
        authorAvatar: 'green'
      });
      setPosts([newP, ...posts]);
      setPostTitle('');
      setPostContent('');
      setSelectedProblemTag('');
      setIsNewPostOpen(false);
      const comms = await api.getCommunities();
      setCommunities(comms);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const upvotes = await api.upvotePost(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, upvotes } : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReply = async (postId: string) => {
    if (!replyText.trim()) return;
    try {
      const newReply = await api.addReply(postId, {
        authorUsername: username,
        content: replyText
      });
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, replies: [...p.replies, newReply] };
        }
        return p;
      }));
      setReplyText('');
      setReplyOpenPostId(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center" role="status">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading peer spaces…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Peer communities"
        title="Honest conversations for young adults."
        description="Real spaces organized around the challenges of growing up — first jobs, career burnout, cost of living, loneliness and family expectations. Post under an anonymous handle, with nothing tied to your real identity."
      />

      {/* Topic selector */}
      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="eyebrow mb-3">
          Choose a topic
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((comm) => {
            const iconFile = iconMap[comm.icon] || 'compass.png';
            const isSelected = selectedCommunity?.id === comm.id;
            const topProblem = comm.frequentProblems[0]?.problem;

            return (
              <button
                key={comm.id}
                type="button"
                onClick={() => handleSelectCommunity(comm)}
                aria-pressed={isSelected}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-forest-600 bg-forest-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-forest-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <FlaticonIcon name={iconFile} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{comm.name}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{comm.description}</p>
                  </div>
                </div>

                {topProblem && (
                  <div className="mt-3 flex items-center border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                    <span className="truncate">Most reported: {topProblem}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected community view */}
      {selectedCommunity && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main feed */}
          <div className="space-y-4 lg:col-span-8">
            <div className="panel flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">{selectedCommunity.name}</h2>
                <p className="text-xs text-slate-500">
                  {selectedCommunity.memberCount.toLocaleString()} active members
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostOpen(true)}
                className="btn btn-sm btn-primary shrink-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Write post</span>
              </button>
            </div>

            {/* Posts list */}
            {posts.length === 0 ? (
              <div className="panel p-8 text-center text-sm text-slate-500">
                No posts in this space yet. Share a thought or question.
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="panel space-y-3 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-100 text-[10px] font-bold text-forest-800" aria-hidden="true">
                        {post.authorUsername.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="font-semibold text-slate-700">@{post.authorUsername}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="chip">{post.problemTag}</span>
                      <span className="flex items-center text-slate-400">
                        <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
                        <time dateTime={post.createdAt}>
                          {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold">{post.title}</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{post.content}</p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-1 hover:text-forest-700"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{post.upvotes}</span>
                        <span className="sr-only">upvotes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyOpenPostId(replyOpenPostId === post.id ? null : post.id)}
                        aria-expanded={replyOpenPostId === post.id}
                        className="flex items-center gap-1 hover:text-forest-700"
                      >
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{post.replies?.length || 0} replies</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400">Anonymous post</span>
                  </div>

                  {/* Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="space-y-2 border-l-2 border-forest-200 pl-3 sm:pl-4">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold text-forest-700">@{reply.authorUsername}</span>
                            <time dateTime={reply.createdAt}>
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </time>
                          </div>
                          <p className="text-slate-800">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  {replyOpenPostId === post.id && (
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      <label htmlFor={`reply-${post.id}`} className="sr-only">
                        Reply to this post
                      </label>
                      <input
                        id={`reply-${post.id}`}
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply as @${username}…`}
                        className="field text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(post.id);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(post.id)}
                        className="btn btn-sm btn-primary shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-4" aria-label="Community details">
            <section className="panel p-5">
              <h2 className="text-sm font-semibold">Frequent issues</h2>
              <p className="mb-4 mt-1 text-xs text-slate-500">
                What peers in {selectedCommunity.name} report dealing with most:
              </p>

              <div className="space-y-3">
                {selectedCommunity.frequentProblems.map((fp, idx) => {
                  const maxCount = Math.max(...selectedCommunity.frequentProblems.map(p => p.count));
                  const percentage = Math.round((fp.count / (maxCount || 1)) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between gap-2 text-xs">
                        <span className="text-slate-700">{fp.problem}</span>
                        <span className="shrink-0 font-mono text-[11px] text-forest-700">{fp.count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-forest-600 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="rounded-lg border border-forest-200 bg-forest-50 p-4 text-xs">
              <span className="mb-1 flex items-center gap-1.5 font-semibold text-forest-900">
                <FlaticonIcon name="shield.png" className="h-3.5 w-3.5 text-forest-700" />
                Safe community standards
              </span>
              <p className="leading-relaxed text-forest-800">
                Posts are anonymous. Real names and personal contact details are never attached to community logs.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* New post modal */}
      <Modal
        isOpen={isNewPostOpen && !!selectedCommunity}
        onClose={() => setIsNewPostOpen(false)}
        title={selectedCommunity ? `Share in ${selectedCommunity.name}` : 'New post'}
        description="Posting as an anonymous handle. Your real identity is never shown."
        maxWidth="max-w-lg"
        footer={
          <>
            <button type="button" onClick={() => setIsNewPostOpen(false)} className="btn btn-sm btn-outline">
              Cancel
            </button>
            <button type="submit" form="new-post-form" className="btn btn-sm btn-primary">
              Submit post
            </button>
          </>
        }
      >
        {selectedCommunity && (
          <form id="new-post-form" onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label htmlFor="post-tag" className="mb-1 block text-xs font-medium text-slate-700">
                Tag the frequent obstacle
              </label>
              <select
                id="post-tag"
                value={selectedProblemTag}
                onChange={(e) => setSelectedProblemTag(e.target.value)}
                className="field"
              >
                <option value="">Choose an issue…</option>
                {selectedCommunity.frequentProblems.map((fp, i) => (
                  <option key={i} value={fp.problem}>{fp.problem}</option>
                ))}
                <option value="General Discussion">General discussion</option>
              </select>
            </div>

            <div>
              <label htmlFor="post-title" className="mb-1 block text-xs font-medium text-slate-700">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                required
                placeholder="e.g. Dealing with Sunday night dread…"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="post-content" className="mb-1 block text-xs font-medium text-slate-700">
                Your thoughts
              </label>
              <textarea
                id="post-content"
                required
                rows={5}
                placeholder="Describe what you are navigating…"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="field"
              />
            </div>

            <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">
              Posting as <strong className="font-semibold text-forest-700">@{username}</strong>
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
};
