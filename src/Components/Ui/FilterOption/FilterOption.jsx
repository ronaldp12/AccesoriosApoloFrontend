import { ChevronDown } from 'lucide-react';

export const FilterOption = ({ number, label, options, value, onChange }) => {
    return (
        <div className="filter-option">
            <span className="filter-number">{number}</span>
            <div className="custom-select-container">
                <div className="select-wrapper">
                    <select
                        className="filter-select"
                        value={value}
                        onChange={onChange}
                    >
                        <option value="">{label}</option>
                        {options.map((opt, index) => (
                            <option key={index} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <div className="select-icon">
                        <i className="hgi hgi-stroke hgi-circle-arrow-down-02"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};
