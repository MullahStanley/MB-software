import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  TrendingUp, 
  Plus, 
  Share2, 
  Compass, 
  Briefcase, 
  Coins, 
  HeartHandshake, 
  Shield, 
  Moon,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { api, Community, Post } from '../api';

const iconMap: Record<string, any> = {
  Compass,
  Briefcase,
  Coins,
  HeartHandshake,
  Shield,
  Moon
};

interface CommunitiesProps {
  username: string;
  onTriggerThreshold: (level: number) => void;
}

export const Communities: React.FC<CommunitiesProps> = ({ username, onTriggerThreshold }) => {
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
        authorAvatar: 'teal'
      });
      setPosts([newP, ...posts]);
      setPostTitle('');
      setPostContent('');
      setSelectedProblemTag('');
      setIsNewPostOpen(false);
      // Reload communities to update problem frequencies
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
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading authentic peer communities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Banner / Young Adult Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Sub-divided Peer Spaces for Young Adults (15–35)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You are not late, defective, or alone in this transition.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Real peer communities tracking the most frequent developmental obstacles—from quarter-life panic and first-job burnout to modern loneliness and rent anxiety. Post pseudonymously with zero social judgment.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400">Feeling at your limit?</span>
            <button
              onClick={() => onTriggerThreshold(1)}
              className="text-xs px-2.5 py-1 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25"
            >
              Level 1: Community Connection
            </button>
            <button
              onClick={() => onTriggerThreshold(4)}
              className="text-xs px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
            >
              Level 4: Contact Circle
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Community Channels Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Select A Topic Community
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {communities.map((comm) => {
            const Icon = iconMap[comm.icon] || Compass;
            const isSelected = selectedCommunity?.id === comm.id;
            const topProblem = comm.frequentProblems[0]?.problem;

            return (
              <div
                key={comm.id}
                onClick={() => handleSelectCommunity(comm)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-850 border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-teal-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{comm.name}</h3>
                      <span className="text-xs text-slate-400">{comm.memberCount.toLocaleString()} peers active</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{comm.description}</p>
                {topProblem && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center space-x-1.5 text-xs text-amber-300/90 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Top issue: {topProblem}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Community Detail & Problem Frequency Tracker */}
      {selectedCommunity && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed: 2 Cols */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCommunity.name}</h3>
                <p className="text-xs text-slate-400">Share your experiences or offer perspective</p>
              </div>
              <button
                onClick={() => setIsNewPostOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Reflection</span>
              </button>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <div className="bg-slate-900/60 rounded-xl p-8 border border-slate-800 text-center">
                <p className="text-sm text-slate-400">No posts in this space yet. Be the first to share your thoughts.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3 hover:border-slate-750 transition-all">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px]">
                        {post.authorUsername.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-200">@{post.authorUsername}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-400 border border-teal-800/40 text-[11px]">
                        {post.problemTag}
                      </span>
                      <span className="flex items-center text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-white">{post.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/70 text-xs">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center space-x-1 text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.upvotes} found helpful</span>
                      </button>
                      <button
                        onClick={() => setReplyOpenPostId(replyOpenPostId === post.id ? null : post.id)}
                        className="flex items-center space-x-1 text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.replies?.length || 0} Replies</span>
                      </button>
                    </div>
                    <span className="text-slate-500 text-[11px]">Pseudonymous Young Peer</span>
                  </div>

                  {/* Replies section */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-slate-800 space-y-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-slate-850/80 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="font-semibold text-teal-300">@{reply.authorUsername}</span>
                            <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-200">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline reply box */}
                  {replyOpenPostId === post.id && (
                    <div className="mt-2 pt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply as @${username}...`}
                        className="flex-1 bg-slate-950 text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(post.id)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Sidebar: Frequent Problems Tracker for this Community */}
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">Most Frequent Obstacles</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Sub-divided community tracking of what young adults in {selectedCommunity.name} are facing most often:
              </p>

              <div className="space-y-3">
                {selectedCommunity.frequentProblems.map((fp, idx) => {
                  const maxCount = Math.max(...selectedCommunity.frequentProblems.map(p => p.count));
                  const percentage = Math.round((fp.count / (maxCount || 1)) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium line-clamp-1">{fp.problem}</span>
                        <span className="text-teal-400 font-mono text-[11px] shrink-0 ml-2">{fp.count} logs</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 p-3 rounded-lg bg-teal-950/40 border border-teal-800/40 text-xs text-teal-200">
                <span className="font-semibold block mb-0.5">Developmental Insight</span>
                Over 70% of people experiencing this report feeling instant relief upon finding peers with the exact same doubt.
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-slate-300 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Safe & Anonymized</span>
              </span>
              <p>
                Your username is pseudonymous. No real names, phone numbers, or social handles are displayed publicly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostOpen && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Share to {selectedCommunity.name}
              </h3>
              <button
                onClick={() => setIsNewPostOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tag the Specific Obstacle
                </label>
                <select
                  value={selectedProblemTag}
                  onChange={(e) => setSelectedProblemTag(e.target.value)}
                  className="w-full bg-slate-950 text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- Choose Frequent Problem --</option>
                  {selectedCommunity.frequentProblems.map((fp, i) => (
                    <option key={i} value={fp.problem}>{fp.problem}</option>
                  ))}
                  <option value="General Question">General Question or Story</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dealing with weekend Slack anxiety..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-slate-950 text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reflection / Story
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What are you experiencing? Feel free to be completely candid."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-slate-950 text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Posting as: <strong className="text-teal-300">@{username}</strong></span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPostOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium shadow"
                  >
                    Post Anonymously
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
