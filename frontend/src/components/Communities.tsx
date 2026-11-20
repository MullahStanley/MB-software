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
        <div className="w-10 h-10 border-4 border-[#B9D2B9] border-t-[#1B4326] rounded-full animate-spin"></div>
        <p className="text-sm text-[#2B2E2B]/80 font-medium">Loading authentic peer communities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Banner / Young Adult Context */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1B4326] text-[#F4F1EA] p-6 sm:p-8 border-2 border-[#1B4326] shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-3 border border-[#2E6F40]/30">
            <Users className="w-3.5 h-3.5 text-[#1B4326]" />
            <span>Sub-divided Peer Spaces for Authentic Solidarity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F4F1EA] tracking-tight">
            You are not late, defective, or alone in this transition.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#F4F1EA]/85 leading-relaxed font-normal">
            Real peer communities tracking the most frequent developmental obstacles—from quarter-life panic and first-job burnout to modern loneliness and rent anxiety. Post pseudonymously with zero social judgment.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[#C8B87E] font-medium">Feeling at your limit?</span>
            <button
              onClick={() => onTriggerThreshold(1)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#FFFFFF]/15 text-[#F4F1EA] border border-[#F4F1EA]/30 hover:bg-[#FFFFFF]/25 font-medium transition-all"
            >
              Level 1: Community Connection
            </button>
            <button
              onClick={() => onTriggerThreshold(4)}
              className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 font-medium transition-all"
            >
              Level 4: Contact Circle
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B9D2B9]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Community Channels Grid */}
      <div>
        <h2 className="text-xs font-bold text-[#2E6F40] uppercase tracking-wider mb-3">
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
                    ? 'bg-[#FFFFFF] border-2 border-[#1B4326] shadow-md ring-2 ring-[#2E6F40]/20'
                    : 'bg-[#FFFFFF] border border-[#D8D4C9] hover:border-[#1B4326]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#1B4326] text-[#F4F1EA]' : 'bg-[#B9D2B9]/50 text-[#1B4326]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#1B4326]">{comm.name}</h3>
                      <span className="text-xs text-[#2B2E2B]/70">{comm.memberCount.toLocaleString()} peers active</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#2B2E2B]/80 mt-2 line-clamp-2 leading-relaxed">{comm.description}</p>
                {topProblem && (
                  <div className="mt-3 pt-2.5 border-t border-[#D8D4C9] flex items-center space-x-1.5 text-xs text-[#2E6F40] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#2E6F40] shrink-0" />
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
            <div className="flex items-center justify-between bg-[#FFFFFF] p-4 rounded-xl border border-[#D8D4C9] shadow-sm">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B4326]">{selectedCommunity.name}</h3>
                <p className="text-xs text-[#2B2E2B]/75">Share your experiences or offer perspective</p>
              </div>
              <button
                onClick={() => setIsNewPostOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Reflection</span>
              </button>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-xl p-8 border border-[#D8D4C9] text-center shadow-sm">
                <p className="text-sm text-[#2B2E2B]/75">No posts in this space yet. Be the first to share your thoughts.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-[#FFFFFF] rounded-xl p-5 border border-[#D8D4C9] space-y-3 hover:border-[#1B4326] transition-all shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#2B2E2B]/70">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#B9D2B9] text-[#1B4326] flex items-center justify-center font-bold text-[10px]">
                        {post.authorUsername.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-[#1B4326]">@{post.authorUsername}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#B9D2B9]/60 text-[#1B4326] border border-[#2E6F40]/20 text-[11px] font-medium">
                        {post.problemTag}
                      </span>
                      <span className="flex items-center text-[#2B2E2B]/60">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-serif font-bold text-[#1B4326]">{post.title}</h4>
                  <p className="text-sm text-[#2B2E2B] leading-relaxed whitespace-pre-line">{post.content}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#D8D4C9] text-xs">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center space-x-1 text-[#2B2E2B]/80 hover:text-[#1B4326] transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.upvotes} found helpful</span>
                      </button>
                      <button
                        onClick={() => setReplyOpenPostId(replyOpenPostId === post.id ? null : post.id)}
                        className="flex items-center space-x-1 text-[#2B2E2B]/80 hover:text-[#1B4326] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.replies?.length || 0} Replies</span>
                      </button>
                    </div>
                    <span className="text-[#2E6F40] font-medium text-[11px]">Pseudonymous Young Peer</span>
                  </div>

                  {/* Replies section */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-[#B9D2B9] space-y-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-[#F4F1EA] p-2.5 rounded-lg text-xs space-y-1 border border-[#D8D4C9]">
                          <div className="flex items-center justify-between text-[#2B2E2B]/70 text-[11px]">
                            <span className="font-semibold text-[#1B4326]">@{reply.authorUsername}</span>
                            <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[#2B2E2B]">{reply.content}</p>
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
                        className="flex-1 bg-[#FFFFFF] text-xs px-3 py-1.5 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(post.id)}
                        className="px-3 py-1.5 bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] rounded-lg text-xs font-semibold"
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
            <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#D8D4C9] shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#2E6F40]" />
                <h3 className="font-serif font-bold text-sm text-[#1B4326]">Most Frequent Obstacles</h3>
              </div>
              <p className="text-xs text-[#2B2E2B]/80 mb-4 leading-relaxed">
                Sub-divided community tracking of what young adults in {selectedCommunity.name} are facing most often:
              </p>

              <div className="space-y-3">
                {selectedCommunity.frequentProblems.map((fp, idx) => {
                  const maxCount = Math.max(...selectedCommunity.frequentProblems.map(p => p.count));
                  const percentage = Math.round((fp.count / (maxCount || 1)) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#2B2E2B] font-medium line-clamp-1">{fp.problem}</span>
                        <span className="text-[#2E6F40] font-mono text-[11px] shrink-0 ml-2 font-bold">{fp.count} logs</span>
                      </div>
                      <div className="w-full bg-[#F4F1EA] h-2 rounded-full overflow-hidden border border-[#D8D4C9]">
                        <div
                          className="bg-[#2E6F40] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 p-3 rounded-lg bg-[#B9D2B9]/30 border border-[#2E6F40]/30 text-xs text-[#1B4326]">
                <span className="font-bold block mb-0.5">Developmental Insight</span>
                Over 70% of people experiencing this report feeling instant relief upon finding peers with the exact same doubt.
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-[#FFFFFF] rounded-xl p-4 border border-[#D8D4C9] text-xs text-[#2B2E2B]/80 space-y-2 shadow-sm">
              <span className="font-bold text-[#1B4326] flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-[#2E6F40]" />
                <span>Safe & Anonymized</span>
              </span>
              <p className="leading-relaxed">
                Your username is pseudonymous. No real names, phone numbers, or social handles are displayed publicly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostOpen && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full border-2 border-[#1B4326] p-6 space-y-4 shadow-2xl text-[#2B2E2B]">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8D4C9]">
              <h3 className="text-base font-serif font-bold text-[#1B4326]">
                Share to {selectedCommunity.name}
              </h3>
              <button
                onClick={() => setIsNewPostOpen(false)}
                className="text-[#2B2E2B]/60 hover:text-[#1B4326] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B4326] mb-1">
                  Tag the Specific Obstacle
                </label>
                <select
                  value={selectedProblemTag}
                  onChange={(e) => setSelectedProblemTag(e.target.value)}
                  className="w-full bg-[#F4F1EA] text-xs px-3 py-2 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                >
                  <option value="">-- Choose Frequent Problem --</option>
                  {selectedCommunity.frequentProblems.map((fp, i) => (
                    <option key={i} value={fp.problem}>{fp.problem}</option>
                  ))}
                  <option value="General Question">General Question or Story</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B4326] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dealing with weekend Slack anxiety..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-[#F4F1EA] text-xs px-3 py-2 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B4326] mb-1">
                  Reflection / Story
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What are you experiencing? Feel free to be completely candid."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-[#F4F1EA] text-xs px-3 py-2 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                ></textarea>
              </div>

              <div className="flex items-center justify-between text-xs text-[#2B2E2B]/80">
                <span>Posting as: <strong className="text-[#1B4326]">@{username}</strong></span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPostOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#F4F1EA] text-[#2B2E2B] border border-[#D8D4C9] hover:bg-[#D8D4C9]/50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] font-semibold shadow"
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
