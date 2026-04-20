"""add is_draft to other Models

Revision ID: 529c602a006e
Revises: ac4ad73d656a
Create Date: 2026-04-19 19:15:44.931845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '529c602a006e'
down_revision: Union[str, Sequence[str], None] = 'ac4ad73d656a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # We add the column with a server_default so existing rows get 'True'
    op.add_column('education', 
        sa.Column('is_draft', sa.Boolean(), nullable=False, server_default=sa.text('true'))
    )
    op.add_column('tags', 
        sa.Column('is_draft', sa.Boolean(), nullable=False, server_default=sa.text('true'))
    )
    op.add_column('work_experience', 
        sa.Column('is_draft', sa.Boolean(), nullable=False, server_default=sa.text('true'))
    )
    
    op.alter_column('education', 'is_draft', server_default=None)
    op.alter_column('tags', 'is_draft', server_default=None)
    op.alter_column('work_experience', 'is_draft', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('work_experience', 'is_draft')
    op.drop_column('tags', 'is_draft')
    op.drop_column('education', 'is_draft')
