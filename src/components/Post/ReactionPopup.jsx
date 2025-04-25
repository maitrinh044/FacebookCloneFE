
import PropTypes from "prop-types";

export default function ReactionPopup({ reactions, onSelect }) {
    return (
        <div className="flex gap-2 bg-white rounded-full shadow-md p-2">
            {reactions.map((reaction) => (
                <button
                    key={reaction.id}
                    onClick={() => onSelect(reaction)}
                    className="text-2xl hover:scale-125 transition-transform"
                    title={reaction.label}
                >
                    {reaction.emoji}
                </button>
            ))}
        </div>
    );
}

ReactionPopup.propTypes = {
    reactions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            emoji: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
};
